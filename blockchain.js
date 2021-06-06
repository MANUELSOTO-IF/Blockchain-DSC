const SHA256 = require('crypto-js/sha256');

class Transaccion{
    constructor(emisor, receptor, monto){
        this.emisor = emisor;
        this.receptor = receptor;
        this.fecha = new Date();
        this.monto = monto;
    }
}

class Bloque{
    constructor(indice, data, preHash){
        this.indice = indice;
        this.fecha = new Date();
        this.data = data;
        this.preHash = preHash;
        this.hash = this.createHash();
        this.nonce = 0;
    }

    createHash(){
        return SHA256(this.indice + this.data + this.fecha + this.nonce).toString();
    }

    minar(dificultad){
        while(!this.hash.startsWith(dificultad)){
            this.nonce++;
            this.hash = this.createHash();
        }
    }
}

class Blockchain{
    constructor(data, dificultad = 'a'){
        this.chain = [new Bloque(0, data, '' )];
        this.dificultad = dificultad;
    }
    
    addBlock(data){
        let preBlock = this.chain[this.chain.length-1];
        let bloque = new Bloque(preBlock.indice+1, data, preBlock.hash);
        bloque.minar(this.dificultad);
        this.chain.push(bloque);
    }

    validar(){
        for(let i = 1; i<this.chain.length; i++){

            if(this.chain[i].preHash != this.chain[i-1].hash){
                return false;
            }
            
            if(this.chain[i].createHash() != this.chain[i].hash ){
                return false;
            }
        }
        return true;
    }

}

let dscoin = new Blockchain("Primer moneda del DSC de cutonala", '00');

let primerPago = new Transaccion("Manuel Soto", "Joel Sanchez", 304.41);
let segundoPago = new Transaccion("Daniel Martinez", "Dilean Shadai", 1005.65);
dscoin.addBlock(primerPago);
dscoin.addBlock(segundoPago);

console.log(JSON.stringify(dscoin.chain, null, 2));
console.log(dscoin.validar());

console.log(dscoin.validar());