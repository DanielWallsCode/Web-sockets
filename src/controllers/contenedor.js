const fs = require('fs');

class Contenedor {
    constructor (nombreArchivo) {
        this.path = nombreArchivo;
    }

    async add(obj) {
        try{
            if (fs.existsSync(this.path)){
                let products = await fs.promises.readFile(this.path, 'utf-8');
                let arrProductos = [];
                if (products.length === 0)
                {
                    obj.id = 1;
                }else
                {
                    let prodJSON = JSON.parse(products);
                    
                    arrProductos = this.transformJSONtoArray(prodJSON);
                    
                    obj.precio = Number(obj.precio)

                    obj.id = arrProductos.length + 1;
                }
                arrProductos.push(obj);
                await fs.promises.writeFile(this.path, JSON.stringify(arrProductos));
            }else{
                obj.id = 1;

                await fs.promises.writeFile(this.path, JSON.stringify([obj]));
            }

            return
            
        }catch(err){
            console.log('Hubo un error al intentar guardar: ', err);
        }
    }

    async getById(id){
        try{
            if (fs.existsSync(this.path)){                
                let products = await fs.promises.readFile(this.path, 'utf-8');
                
                let productList = JSON.parse(products);
                
                let arrProductos = this.transformJSONtoArray(productList);
                let product = arrProductos.find(p => p.id === id);
                if (typeof(product) === 'undefined'){
                    return (`No existe un producto con el id ${id}`);
                }else{
                    return product;
                }

            }else{
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    async getProductsCount(){
        try{
            if (fs.existsSync(this.path)){                
                let products = await fs.promises.readFile(this.path, 'utf-8');
                
                let productList = JSON.parse(products);
                
                return productList.length
            }else{
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    async getAll(){
        try{
            if (fs.existsSync(this.path)){                
                let products = await fs.promises.readFile(this.path, 'utf-8');
                
                let productList = JSON.parse(products);
                
                if (productList.length > 0){
                    return productList;
                }else{
                    return ('No hay productos');
                }
            }else{
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    async deleteById(id){
        let prod = await this.getById(id)
        if (typeof(prod) === 'string') {
            return (`No existe un producto con el id ${id}`);
        }

        let productList = await this.getAll();

        let arr = this.transformJSONtoArray(productList);

        let index =  arr.findIndex(p => p.id === id);
        
        arr.splice(index,1)

        await fs.promises.writeFile('./productos.txt', JSON.stringify(arr));
        
        console.log('El producto se ha eliminado con éxito.')
    }

    async deleteAll(){
        try{
            if (fs.existsSync(this.path)){  
                await fs.promises.writeFile('productos.txt', '');
                console.log('Se han eliminado con éxito todos los productos.')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de productos');
        }
    }

    transformJSONtoArray(json){
        let arrayNuevo = [];
        for (let prod of json){
            arrayNuevo.push(prod);
        }

        return arrayNuevo;
    }

}

module.exports = Contenedor 