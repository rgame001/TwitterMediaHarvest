/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type {
  DownloadFileCommand,
  DownloadFileUseCase,
} from '#domain/useCases/downloadFile'
import type { DownloadConfig } from '#domain/valueObjects/downloadConfig'
import ConflictAction from '#enums/ConflictAction'
import { toError } from 'fp-ts/lib/Either'
import Browser from 'webextension-polyfill'

export class BrowserDownloadFile implements DownloadFileUseCase {
  async process(command: DownloadFileCommand): Promise<UnsafeTask> {
    const downloadId = await Browser.downloads.download(
      downloadConfigToBrowserDownloadOptions(command.target)
    )

    if (!downloadId) return toError(Browser.runtime.lastError)
  }
}

const downloadConfigToBrowserDownloadOptions = (
  config: DownloadConfig
): Browser.Downloads.DownloadOptionsType =>
  config.mapBy(props => {
    const options = {
      filename: props.filename,
      conflictAction: props.conflictAction,
      url: props.url,
      ...(__FIREFOX__ ? { saveAs: props.saveAs } : {}),
    }

    if (__FIREFOX__ && options.conflictAction === ConflictAction.Prompt) {
      const { conflictAction, ...rest } = options
      return rest
    }

    return {
      filename: props.filename,
      conflictAction: props.conflictAction,
      url: props.url,
    }
  })
