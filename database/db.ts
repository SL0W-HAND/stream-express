// This is not a real database,
// But let's imagine it is one :)
import allData from './data'

interface TypeVideo {
    id: number,
    name: string,
    duration: number
}

interface pageVideos {
  page: number,
  total_pages: number,
  videos: TypeVideo[]
}

// separe array in chunks of 10
function chunkArray(myArray:any, chunk_size:number):pageVideos[] {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  let pageNumber = 1;
  for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index+chunk_size);
      // Do something if you want with the group
      let page:pageVideos = {
        page: pageNumber,
        total_pages: Math.ceil(arrayLength/chunk_size),
        videos: myChunk
      }
      pageNumber ++
      tempArray.push(page);
  }
  return tempArray;
}



class Database {
    constructor() {}
  
    //if you have a lot of data, dont use this
    async getAll():Promise<TypeVideo[]> {
        const asArray:TypeVideo[] = Object.values(allData)
        return asArray
    }
  
    async getPages(): Promise<pageVideos[]> {
        const pages = chunkArray(Object.values(allData), 10)
        await randomDelay()
        return pages
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