import service from '@/utils/request'

export const useAbilityApi = (id: Number) => {
	return service.get('problem/ability/' + id)
}

export const useAbilitySubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('problem/ability', dataForm)
	} else {
		return service.post('problem/ability', dataForm)
	}
}
export const useItemAbilityApi = () => {
	return service.get('problem/ability/item/list/' )
}

export const judgeUnlockApi = (lastAbilityId:any,abilityId:any) => {
	return service.get("problem/ability/judgeUnlockAbility",{
		params:{
			lastAbilityId:lastAbilityId,
			abilityId:abilityId
		}

	})
}

export const dataListUrl = 'problem/ability/list'

export const deleteUrl = 'problem/ability'
