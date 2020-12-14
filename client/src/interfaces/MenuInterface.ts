export interface MenuInterface extends Array<MenuItem>{}

interface MenuItem{
  name: String,
  action: ()=>boolean
}