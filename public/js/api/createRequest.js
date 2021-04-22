/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
        let request = new XMLHttpRequest();

        let formData = new FormData();
        for(var key in options.data) {
            formData.append(key, options.data[key]);
        }
     
        try {
            request.open(options.method, options.url);
            request.send(formData); 
        }
        catch (error) {
            // перехват сетевой ошибки
            callback(error);
        }  
            
        request.addEventListener('readystatechange', function() { 
           if (request.readyState === request.DONE && request.status === 200) {
                let data = JSON.parse(this.response);
                    if(data.success) {
                        options.callback('', data);
                    } else {
                        options.callback(data.error, data.success);
                    }
            }
        }); 
};
