export interface IGroup{
    groupName: string,
    dollarMinimum: number,
    dollarMaximum: number,
    groupDescription: string, // can include additional rules
    groupDeadline: Date,
}