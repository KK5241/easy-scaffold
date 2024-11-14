import path from 'path'
import fs from 'fs-extra'
import { confirm }  from '@inquirer/prompts'
import Generator from './generator.js'


export async function createFile(name, options){

    const cwdPath = process.cwd()
    const filePath = path.join(cwdPath, name)

    // 首先判断当前目录是否有该文件，再根据配置选择是否强制覆盖
    if(fs.existsSync(filePath)){
        if(options.force){
            await fs.remove(filePath)
        }else{
            const result = await confirm({
                message:'The file has exists,Do you want to overWrite?'
            })
            if(result){
                await fs.remove(filePath)
            }else{
                process.exit(1)
            }
            
        }
    }
    // generator 生成模板文件
    const gen = new Generator(name, cwdPath)
    gen.create()
}