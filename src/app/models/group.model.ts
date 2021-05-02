export interface IGroup{
    guid: string,
    groupName: string,
    dollarMinimum: number,
    dollarMaximum: number,
    groupDescription: string, // can include additional rules
    groupDeadline: Date,
    houseHolds?: string
}