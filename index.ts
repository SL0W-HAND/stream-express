import config from "./config/index"
const app = require("./app");

app.listen(config.port,()=>{
    console.log(`server runing on port ${config.port}`)
})