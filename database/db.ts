// This is not a real database,
// But let's imagine it is one :)
import allData from './data'

interface TypeVideo {
    id: number,
    name: string,
    duration: number
}

class Database {
    constructor() {}
    
    async getAll():Promise<TypeVideo[]> {
        const asArray:TypeVideo[] = Object.values(allData)
        return asArray
    }

    async getById(id: string): Promise<TypeVideo | null> {
        if (!Object.prototype.hasOwnProperty.call(allData, id)) {
          return null
        }
        const entry = allData[id]
        await randomDelay()
        return entry
    }
    async getByString(str: string): Promise<TypeVideo[]| null> {
        if(str.length === 0) {
            return null
        }
        const asArray:TypeVideo[] = Object.values(allData)
        const results = asArray.filter((data:TypeVideo) => {
          return data.name.toLowerCase().includes(str);
        });
        await randomDelay()
        return results
    }
}

// Let's also add a delay to make it a bit closer to reality
const randomDelay = () =>
  new Promise((resolve) => {
    const max = 350
    const min = 100
    const delay = Math.floor(Math.random() * (max - min + 1)) + min

    setTimeout(resolve, delay)
})

  export default Database