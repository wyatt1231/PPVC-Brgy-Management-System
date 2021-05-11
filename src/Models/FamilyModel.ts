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
  ulo_pamilya_info?: ResidentModel;
  fam_members?: Array<FamMemberModel>;
  biktima_pangabuso?: Array<string>;
  kahimtanang_komunidad?: Array<string>;
  matang_basura?: Array<string>;
  matang_kasilyas?: Array<string>;
  pasilidad_kuryente?: Array<string>;
  family_matang_basura?: Array<string>;
  tinubdan_tubig?: Array<string>;
  serbisyo_nadawat?: Array<SerbisyoNadawatModel>;
}
export interface FamMemberModel {
  resident_pk?: number;
  fam_pk?: number;
  rel?: string;
  encoded_at?: Date | string;
  encoded_by?: number;
  resident_info: ResidentModel;
}

export interface SerbisyoNadawatModel {
  programa: string;
  ahensya: string;
}
