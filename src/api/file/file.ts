import service from "@/utils/request";

export const downloadStudentTemplateApi = () => {
    return service.get('/file/template/enrollExcel/',
        {
            responseType: 'blob'
        })
        .then(res => {
            console.log(res)
            downloadFileApi(res)
        })
}
export const useImportExcelApi = (file: any) => {
    return service.post('/sale/enroll/import/sale', file)
}

export const upload = (file: any) => {
    return service.post('/file/upload', file)
}
export const getPdfUrlApi = (path: string) => {
    return service.get('/file/preview/pdf2', {
        params: {
            path: path
        },
        responseType: 'blob'
    })
}
export const readSampleApi = (path: string) => {
    return service.get('/file/samplesample/download', {
        params: {
            path: path
        },

        responseType: 'blob'
    })
}

export const downloadSampleApi = (path: string) => {
    return service
        .get('/file/sample/download', {
            params: {
                path: path
            },
            responseType: 'blob'
        })
        .then(res => {
            downloadFileApi(res)
        })
}
export const downloadProblemTemplateApi = (type: number) => {
    return service
        .get('/file/template/problemExcel/' + type, {
            responseType: 'blob'
        })
        .then(res => {
            downloadFileApi(res)
        })
}

export const downloadStudentInfoConfirmApi = () => {
    return service
        .get('/file/template/studentInfoConfirmExcel/', {
            responseType: 'blob'
        })
        .then(res => {
            downloadFileApi(res)
        })
}
export const downloadArchiveTemplateApi = () => {
    return service
        .get('/file/template/archiveExcel/', {
            responseType: 'blob'
        })
        .then(res => {
            downloadFileApi(res)
        })
}

export const downloadArchiveScoreBookTemplateApi = () => {
    return service
        .get('/file/template/archiveScoreBookExcel/', {
            responseType: 'blob'
        })
        .then(res => {
            downloadFileApi(res)
        })
}
export const downloadFileApi = (res: any) => {
    // 切割出文件名
    const fileNameEncode = (res.headers['content-disposition'] || '').split('filename=')[1]

    //解码
    const fileName = decodeURIComponent(fileNameEncode)
    //decodeURIComponent(fileNameEncode)
    // 设置type类型
    const blob = new Blob([res.data], {
        type: 'text/plain; charset=utf-8'
    })
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `${fileName}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
