import {SoftwareItem} from '../types/SoftwareItem'

export function getSoftwareMentionsCnt(software:SoftwareItem){
try{
  const {related:{mentions}} = software
  if (mentions){
    return mentions.length
  }
  return 0
}catch(e){
  return 0
}}

export function getSoftwareProjectCnt(software:SoftwareItem){
try{
  const {related:{projects}} = software
  if (projects){
    return projects.length
  }
  return 0
}catch(e){
  return 0
}}

export function getSoftwareOrganizationCnt(software:SoftwareItem){
try{
  const {related:{organizations}} = software
  if (organizations){
    return organizations.length
  }
  return 0
}catch(e){
  return 0
}}