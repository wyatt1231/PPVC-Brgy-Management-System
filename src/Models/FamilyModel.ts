import { ResidentModel } from "./ResidentModels";

export interface FamilyModel {
  fam_pk?: number;
  ulo_pamilya?: number;
  okasyon_balay?: string;
  straktura?: string;
  kadugayon_pagpuyo?: number;
  okasyon_yuta?: string;
  kaligon_balay?: string;
  waterconnection?: string,
  hasComfortRoom?: string,
  hasLightConnection?: string,
  wastemanagement?: string,
  kahimtang_komunidad?:string,
  victimofabuse?: string,
  skilltraining?: string,
  daycareservice?: string,
  Employment?: string,
  medicalngatabang?: string,
  lingap?: string,
  houseing?: string,
  financial?:string,
  fourps?: string,
  livelihood?: string,
  scholarship?: string,
  encoded_at?: Date | string;
  encoded_by?: number;
  ulo_pamilya_info: ResidentModel;
  fam_members: Array<FamMemberModel>;
}

export interface FamMemberModel {
  resident_pk?: number;
  fam_pk?: number;
  rel?: string;
  encoded_at?: Date | string;
  encoded_by?: number;
  resident_info: ResidentModel;
}
