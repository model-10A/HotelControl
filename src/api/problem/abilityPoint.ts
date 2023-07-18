import service from '@/utils/request'



export const useAbilityMapApi = (id: number) => {
    return service.get('problem/ability/map/' + id)
}
export const useUserAbilityMapApi = (id: number) => {
    return service.get('problem/ability/map/user/' + id)
}
export const insertAbilityPointApi = (dataForm: any) => {
    return service.post('problem/ability/map/point/', dataForm)
}

export const updateAbilityPointApi = (dataForm: any) => {
    return service.put('problem/ability/map/point/', dataForm)
}

export const updateAbilityPointListApi = (dataForm: any) => {
    return service.put('problem/ability/map/point/list', dataForm)
}

export const deletePointApi = (id: number) => {
    return service.delete('problem/ability/map/point/' + id)
}

export const insertAbilityRelatedApi = (dataForm: any) => {
    return service.post('problem/ability/map/point/related/', dataForm)
}

export const deleteRelatedApi = (id: number) => {
    return service.delete('problem/ability/map/point/related/' + id)
}