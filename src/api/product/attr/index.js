import request from '@/utils/request'

// 获取一级分类列表
export const reqCategory1List = () => {
    return request({
        url: '/admin/product/getCategory1',
        method: 'GET'
    })
}
// 获取二级分类列表
export const reqCategory2List = (category1Id) => {
    return request({
        url: `/admin/product/getCategory2/${category1Id}`,
        method: 'GET'
    })
}

// 获取三级分类列表
export const reqCategory3List = (category2Id) => {
    return request({
        url: `/admin/product/getCategory3/${category2Id}`,
        method: 'GET'
    })
}
// 获取商品属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'GET',
    })
}
// 提交添加的属性
export const reqSubmitAttr = (data) => {
    return request({
        url: '/admin/product/saveAttrInfo',
        method: 'POST',
        data,
    })
}
// 删除商品平台属性
export const reqDeleteAttr = (attrId) => {
    return request({
        url: `/admin/product/deleteAttr/${attrId}`,
        method: 'DELETE'
    })
}