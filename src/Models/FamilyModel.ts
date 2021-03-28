import { ResidentModel } from "./ResidentModels";

export interface FamilyModel {
  fam_pk?: number;
  ulo_pamilya?: number;
  okasyon_balay?: string;
  straktura?: string;
  kadugayon_pagpuyo?: number;
  okasyon_yuta?: string;
  kaligon_balay?: string;
  encoded_at?: Date | string;
  encoded_by?: number;
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
