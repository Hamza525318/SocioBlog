 const generateUniqueFileName = ()=>{

    const timestamp  = new Date().getTime();
    const filename = Math.random().toString(36).substring(2,8);
    return `file_${timestamp}_${filename}.txt`;
}

module.exports = {generateUniqueFileName}