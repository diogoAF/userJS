class Utils {
    
    /**
     * 
     * @param {Date} date 
     */
    static dateFormat(date){
        if(Object.prototype.toString.call(date) === "[object Date]") {
            return date.getDate()+'/'
                +(date.getMonth()+1)+'/'
                + date.getFullYear()
        } else {
            return '00/00/0000'
        }
        
    }
}