export type Id = string

/**
 * 分页响应数据
 */
export interface ResPage<T> {
  /** 数据列表 */
  records: T[]
  /** 总数 */
  total: number
  /** 当前页 */
  current: number
  /** 每页数量 */
  size: number
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  current?: number
  size?: number
}

/**
 * API 响应
 */
export interface Res<T = any> {
  code: number
  data: T
  message: string
}
