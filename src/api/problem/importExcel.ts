import service from '@/utils/request'
export const importExcelCodeProblemApi = (data: any) => {
    return service.post('/problem/code/importExcel/', data)
}
export const importExcelFillProblemApi = (data: any) => {
    return service.post('/problem/fill/importExcel/', data)
}

