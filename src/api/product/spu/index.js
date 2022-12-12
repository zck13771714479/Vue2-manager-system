import request from '@/utils/request'


// 获取spu列表 /admin/product/{page}/{limit}
export const reqSpuList=(page,limit,category3Id)=>{
    return request({
        url:`/admin/product/${page}/${limit}`,
        method:'GET',
        params:{category3Id},
    })
}
// 通过id获取spu
export const reqSpu=(spuId)=>{
    return request({
        url:`/admin/product/getSpuById/${spuId}`,
        method:'GET',
    })
}
// 获取品牌列表
export const reqtradeMark=()=>{
    return request({
        url:`/admin/product/baseTrademark/getTrademarkList`,
        method:'GET',
    })
}
// 获取图片列表
export const reqSpuImageList=(spuId)=>{
    return request({
        url:`/admin/product/spuImageList/${spuId}`,
        method:'GET',
    })
}
// 获取销售属性
export const reqSaleAttr=()=>{
    return request({
        url:'/admin/product/baseSaleAttrList',
        method:'GET',
    })
}
// 提交修改或者添加spu的结果
export const reqAddOrUpdateSpu=(spuInfo)=>{
    //携带的参数带有id----修改spu
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'POST', data: spuInfo });
    } else {
        //携带的参数不带id---添加SPU
        return request({ url: '/admin/product/saveSpuInfo', method: 'POST', data: spuInfo });
    }
}
// 删除spu
export const reqDeleteSpu = (spuId)=>{
    return request({
        url:`/admin/product/deleteSpu/${spuId}`,
        method:'DELETE'
    })
}


