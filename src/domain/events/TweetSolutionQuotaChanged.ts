/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { DomainEvent } from './base'

export default class TweetSolutionQuotaChanged
  extends DomainEvent
  implements QuotaEvent
{
  constructor(
    readonly solutionId: string,
    readonly remainingQuota: number,
    readonly resetTime: Date
  ) {
    super('tweetSolution:quota:changed')
  }
}
