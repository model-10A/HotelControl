import service from '@/utils/request'

export const useStatisticsInfoApi = () => {
    return service.get('/teaching/statistics')
}
