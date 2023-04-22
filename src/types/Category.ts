export enum CATEGORY_STATUS {
	inactive = "inactive",
	active = "active"
}

export interface ICategory {
    name: string
    status: CATEGORY_STATUS
}