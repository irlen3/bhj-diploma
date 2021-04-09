/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    try {
        let request = new XMLHttpRequest();
       
        if (options.method != 'GET') {
             let formData = new FormData();
            if(options.data.name) 
                formData.append('name', options.data.name);
            if(options.data.email)
                formData.append('email', options.data.email);
            if(options.data.password)
                formData.append('password', options.data.password);
            if(options.data.account_id)
                formData.append('account_id', options.data.account_id);
            if(options.data.sum)
                formData.append('sum', options.data.sum);
            if(options.data.type)
                formData.append('type', options.data.type);
            if(options.data.id)
                formData.append('id', options.data.id);

            request.open(options.method, options.url);
            request.send(formData); 
        } else {
                if(options.url === '/transaction') 
                     options.url +='?account_id=' + options.data;
     
            request.open(options.method, options.url, true);
            request.send(); 
        }
            
        request.addEventListener('readystatechange', function() { 
           if (request.readyState === request.DONE && request.status === 200) {
                let data = JSON.parse(this.response);
                if(options.method === 'POST') {
                    if(data.success) {
                        options.callback('', data);
                    } else {
                        options.callback(data.error, data.success);
                    }
                }

                if(options.method === 'PUT') {
                    if(data.success && options.url === '/account') {
                        options.callback(data.success, data.account.name);
                    } else {
                        options.callback('', data);
                    }
                }

                if(options.method === 'GET') {
                    if(data.success) {
                        options.callback('', data);
                    } else {
                       
                    }
                }

                if(options.method === 'DELETE') {
                        if(data.success) {
                            options.callback('', data);
                        } else {
                           
                        }
             
                 }
            }
        });
      
    }
      catch (error) {
        // перехват сетевой ошибки
        return(error);
      }
};
