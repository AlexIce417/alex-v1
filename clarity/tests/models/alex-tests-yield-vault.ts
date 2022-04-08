
import {Clarinet, Tx, Chain, Account, types} from "https://deno.land/x/clarinet@v0.14.0/index.ts";

class YieldVault{
    chain: Chain;
    contractName: string;

    constructor(chain: Chain, contractName: string) {
        this.chain = chain;
        this.contractName = contractName;
    }

    // (define-public (add-to-position (dx uint))
    addToPosition(sender: Account, dx: number){
        return Tx.contractCall(
            this.contractName,
            "add-to-position",
            [
                types.uint(dx)
            ],
            sender.address
        );
    }

    claimAndStake(sender: Account, reward_cycle: number){
        return Tx.contractCall(
            this.contractName,
            "claim-and-stake",
            [
                types.uint(reward_cycle)
            ],
            sender.address
        )
    }

    reducePosition(sender: Account){
        return Tx.contractCall(
            this.contractName,
            "reduce-position",
            [],
            sender.address
        )
    }

    setActivated(sender: Account, activated: boolean){
        return Tx.contractCall(
            this.contractName,
            "set-activated",
            [
                types.bool(activated)
            ],
            sender.address
        )
    }

    getNextBase(sender: Account){
        return this.chain.callReadOnlyFn(
            this.contractName,
            "get-next-base",
            [],
            sender.address
        )
    }
    
    SetBountyInFixed(sender: Account, bounty_in_fixed: number){
        return Tx.contractCall(
            this.contractName,
            "set-bounty-in-fixed",
            [
                types.uint(bounty_in_fixed)
            ],
            sender.address
        )
    }
    
    getBountyInFixed(sender: Account){
        return this.chain.callReadOnlyFn(
            this.contractName,
            "get-bounty-in-fixed",
            [],
            sender.address
        )
    }     
}

class YieldVaultFarm{
    chain: Chain;

    constructor(chain: Chain) {
        this.chain = chain;
    }

    addToken(sender: Account, token: string){
        return Tx.contractCall(
            "yield-vault",
            "add-token",
            [
                types.principal(token)
            ],
            sender.address
        );
    }

    // (define-public (add-to-position (dx uint))
    addToPosition(sender: Account, token: string, dx: number){
        return Tx.contractCall(
            "yield-vault",
            "add-to-position",
            [
                types.principal(token),
                types.uint(dx)
            ],
            sender.address
        );
    }

    claimAndStake(sender: Account, token: string, reward_cycle: number){
        return Tx.contractCall(
            "yield-vault",
            "claim-and-stake",
            [
                types.principal(token),
                types.uint(reward_cycle)
            ],
            sender.address
        )
    }

    reducePosition(sender: Account, token: string){
        return Tx.contractCall(
            "yield-vault",
            "reduce-position",
            [
                types.principal(token),
            ],
            sender.address
        )
    }

    setActivated(sender: Account, token: string, activated: boolean){
        return Tx.contractCall(
            "yield-vault",
            "set-activated",
            [
                types.principal(token),
                types.bool(activated)
            ],
            sender.address
        )
    }

    getNextBase(sender: Account, token: string){
        return this.chain.callReadOnlyFn(
            "yield-vault",
            "get-next-base",
            [
                types.principal(token),
            ],
            sender.address
        )
    }
    
    SetBountyInFixed(sender: Account, token: string, bounty_in_fixed: number){
        return Tx.contractCall(
            "yield-vault",
            "set-bounty-in-fixed",
            [
                types.principal(token),
                types.uint(bounty_in_fixed)
            ],
            sender.address
        )
    }
    
    getBountyInFixed(sender: Account, token: string){
        return this.chain.callReadOnlyFn(
            "yield-vault",
            "get-bounty-in-fixed",
            [
                types.principal(token),
            ],
            sender.address
        )
    }     
}

export { YieldVault, YieldVaultFarm }
