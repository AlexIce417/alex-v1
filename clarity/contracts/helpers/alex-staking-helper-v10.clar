
;; helper functions:

(define-read-only (get-staker-at-cycle-or-default-by-tx-sender (reward-cycle uint))
  (contract-call? .alex-reserve-pool-v10 get-staker-at-cycle-or-default .token-t-alex-v2 reward-cycle (default-to u0 (contract-call? .alex-reserve-pool-v10 get-user-id .token-t-alex-v2 tx-sender)))
)
(define-read-only (get-staked (reward-cycles (list 2000 uint)))
  (map get-staker-at-cycle-or-default-by-tx-sender reward-cycles)
)
(define-read-only (get-staking-reward-by-tx-sender (target-cycle uint))
  (contract-call? .alex-reserve-pool-v10 get-staking-reward .token-t-alex-v2 (default-to u0 (contract-call? .alex-reserve-pool-v10 get-user-id .token-t-alex-v2 tx-sender)) target-cycle)
)
(define-read-only (get-staking-rewards (reward-cycles (list 2000 uint)))
  (map get-staking-reward-by-tx-sender reward-cycles)
)
(define-public (claim-staking-reward-by-tx-sender (reward-cycle uint))
  (contract-call? .alex-reserve-pool-v10 claim-staking-reward .token-t-alex-v2 reward-cycle)
)
(define-public (claim-staking-reward (reward-cycles (list 2000 uint)))
  (ok (map claim-staking-reward-by-tx-sender reward-cycles))
)