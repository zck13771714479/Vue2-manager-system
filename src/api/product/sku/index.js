import request from '@/utils/request'

// 添加sku，获取spu图片列表
export const reqSpuImageListInSkuFrom =(spuId)=>{
    return request({
        url:`/admin/product/spuImageList/${spuId}`,
        method:'GET'
    })
}
//添加sku，获取销售属性
export const reqSaleAttrInSkuForm = (spuId)=>{
    return request({
        url:`/admin/product/spuSaleAttrList/${spuId}`,
        method:'GET'
    })
}
// 添加sku，获取平台属性
export const reqAttrInfo=(category1Id,category2Id,category3Id)=>{
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'GET'
    })
}
// 保存添加的sku
export const reqSaveSku = (data)=>{
    return request({
        url:'/admin/product/saveSkuInfo',
        method:'POST',
        data,
    })
}
// 查看sku列表
export const reqSkuList = (spuId)=>{
    return request({
        url:`/admin/product/findBySpuId/${spuId}`,
        method:'GET'
    })
}
// 获取分页sku列表
export const reqPageSkuList=(page,limit)=>{
    return request({
        url:`/admin/product/list/${page}/${limit}`,
        method:'GET'
    })
}
// sku上架
export const reqOnSale=(skuId)=>{
    return request({
        url:`/admin/product/onSale/${skuId}`,
        method:'GET'
    })
}
// sku下架
export const reqCancelSale=(skuId)=>{
    return request({
        url:`/admin/product/cancelSale/${skuId}`,
        method:'GET'
    })
}
// 删除sku
export const reqDeleteSku = (skuId)=>{
    return request({
        url:`/admin/product/deleteSku/${skuId}`,
        method:'DELETE',
    })
}
// sku详情
export const reqSkuDetail=(skuId)=>{
    return request({
        url:`/admin/product/getSkuById/${skuId}`,
        method:'GET',
    })
}