(impl-trait .trait-ownable.ownable-trait)

(define-constant ERR-NOT-AUTHORIZED (err u1000))

(define-constant ONE_8 (pow u10 u8))

(define-data-var contract-owner principal tx-sender)
(define-map approved-contracts principal bool)

(define-read-only (get-contract-owner)
  (ok (var-get contract-owner))
)

(define-public (set-contract-owner (owner principal))
  (begin
    (try! (check-is-owner))
    (ok (var-set contract-owner owner))
  )
)

(define-private (check-is-owner)
  (ok (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED))
)

(define-private (check-is-approved)
  (ok (asserts! (default-to false (map-get? approved-contracts tx-sender)) ERR-NOT-AUTHORIZED))
)

(define-public (add-approved-contract (new-approved-contract principal))
  (begin
    (try! (check-is-owner))
    (ok (map-set approved-contracts new-approved-contract true))
  )
)

(define-public (set-approved-contract (owner principal) (approved bool))
	(begin
		(try! (check-is-owner))
		(ok (map-set approved-contracts owner approved))
	)
)

(define-private (mint-apower-iter (recipient {recipient: principal, amount: uint}) (prior (response uint uint)))
  (begin 
    (as-contract (try! (contract-call? .token-apower mint-fixed (get amount recipient) (get recipient recipient))))
    (ok (+ (try! prior) (get amount recipient)))
  )
)

(define-public (mint-and-burn-apower (recipients (list 200 {recipient: principal, amount: uint})))
	(begin 
		(asserts! (or (is-ok (check-is-owner)) (is-ok (check-is-approved))) ERR-NOT-AUTHORIZED)	
    (let 
      (
        (minted (try! (fold mint-apower-iter recipients (ok u0))))
      )
      (as-contract (contract-call? .token-apower burn-fixed minted .auto-alex))
    )	
	)
)

