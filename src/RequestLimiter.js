class RequestLimiter{
    // a singleton implementation of the RateLimiter
    //limits the number of requests that the component can process per time interval
    constructor() {
        const { RateLimiter} =  require('limiter')
        const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 100})

      
        if(RequestLimiter.instance instanceof RequestLimiter){
            return RequestLimiter.instance;
        }
            
        this.limiter = limiter
        RequestLimiter.instance = this;
    }

    getLimiter(){
        return this.limiter;
    }
}

module.exports = RequestLimiter