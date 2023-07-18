import service from '@/utils/request'

export const getProblemSolving = (id: number) => {
    return service.get('/problem/solving/' + id)
}

export const useProblemExplanationSubmitApi = (dataForm: any) => {
    if (dataForm.id) {
        return service.put('/problem/solving', dataForm)
    } else {
        return service.post('/problem/solving', dataForm)
    }
}

export const deleteProblemSolving = (id: number) => {
    return service.delete('/problem/solving/' + id)
}

export const dataListUrl = '/problem/solving/page'