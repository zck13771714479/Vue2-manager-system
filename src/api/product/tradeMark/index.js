import request from '@/utils/request'

// 获取分页品牌列表
export const reqTradeMarkList = (page,limit)=>{
    return request({
        url:`/admin/product/baseTrademark/${page}/${limit}`,
        method:'GET'
    })
}
// 添加或者修改品牌
export const reqAddOrUpdateTradeMark = (tradeMarkInfo)=>{
    if(tradeMarkInfo.id){
        //更新
        return request({
            url:`/admin/product/baseTrademark/update`,
            method:'PUT',
            data:tradeMarkInfo,
        })
    }else{
        // 添加
        return request({
            url:`/admin/product/baseTrademark/save`,
            method:'POST',
            data:tradeMarkInfo,
        })
    }
}
// 删除品牌
export const reqDeleteTradeMark = (id)=>{
    return request({
        url:`/admin/product/baseTrademark/remove/${id}`,
        method:'DELETE',
    })
}