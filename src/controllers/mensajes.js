const fs = require('fs');

class Mensajes {
    constructor (nombreArchivo) {
        this.path = nombreArchivo;
    }

    async add(obj) {
        try{
            if (fs.existsSync(this.path)){
                
                let messages = await fs.promises.readFile(this.path, 'utf-8');

                let arrMensajes = [];

                if (messages.length === 0)
                {
                    obj.id = 1;
                }else
                {
                    let prodJSON = JSON.parse(messages);
                    
                    arrMensajes = this.transformJSONtoArray(prodJSON);

                    obj.id = arrMensajes.length + 1;
                }

                arrMensajes.push(obj);
                
                await fs.promises.writeFile(this.path, JSON.stringify(arrMensajes));
            }else{
                obj.id = 1;

                await fs.promises.writeFile(this.path, JSON.stringify([obj]));
            }
            return
            
        }catch(err){
            console.log('Hubo un error al intentar guardar: ', err);
        }
    }

    async getMessagesCount(){
        try{
            if (fs.existsSync(this.path)){                
                let messages = await fs.promises.readFile(this.path, 'utf-8');
                
                let messagesList = JSON.parse(messages);
                
                return messagesList.length
            }else{
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de mensajes');
        }
    }

    async getAll(){
        try{
            if (fs.existsSync(this.path)){                
                let messages = await fs.promises.readFile(this.path, 'utf-8');
                
                let messagesList = JSON.parse(messages);
                
                if (messagesList.length > 0){
                    return messagesList;
                }else{
                    return ('No hay mensajes');
                }
            }else{
                console.log('No existe el archivo')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de mensajes');
        }
    }

    async deleteAll(){
        try{
            if (fs.existsSync(this.path)){  
                await fs.promises.writeFile('mensajes.txt', '');
                console.log('Se han eliminado con éxito todos los mensajes.')
            }
        }catch(err){
            console.log('Hubo un error al intentar leer el archivo de mensajes');
        }
    }

    transformJSONtoArray(json){
        let arrayNuevo = [];
        for (let msg of json){
            arrayNuevo.push(msg);
        }

        return arrayNuevo;
    }

}




module.exports = Mensajes 