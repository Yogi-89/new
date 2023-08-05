import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import createPersistedState from "vuex-persistedstate";
const dataState = createPersistedState({
  key: "storecendol",
  paths: [
    "user",
    "userToken",
    "tokenKoperasi",
    "tokenDanaPartisipasi",
    "isDefaultPass",
    "introState",
    "tutorial",
    "menuAddOns",
    "cabdinToken",
    "dataCabdin",
  ],
});

import moment from "moment";
import { _ } from "vue-underscore";
import { ApiGetRequest, ApiDeleteRequest } from "@/utils/Api";

import Intro from "./Intro";
import Roles from "./Roles";
import Provinces from "./Provinces";
import Cities from "./Cities";
import Districts from "./Districts";
import Pengumuman from "./Pengumuman";
import Sekolah from "./Sekolah";

// ==================Pembelajaran=====================
import GuruStaff from "./Pengguna/GuruStaff";
import Pelajar from "./Pengguna/Pelajar";
import FileStorage from "./Pengguna/FileStorage";
import KartuPelajar from "./Pengguna/KartuPelajar";
import RuangKelas from "./Pembelajaran/RuangKelas";
import Ujian from "./Pembelajaran/Ujian";
import JadwalUjian from "./Pembelajaran/JadwalUjian";
import Tugas from "./Pembelajaran/Tugas";
import Mapel from "./Pembelajaran/Mapel";
import JadwalPelajaran from "./Pembelajaran/Jadwal";
import Pembelajaran from "./Pembelajaran";
import Classrooms from "./Classrooms";
import Majors from "./Major";
// ==================Pembelajaran=====================

// ==================Pembelajaran Magang=====================
import Magang from "./Pembelajaran/Magang";
import MagangSettingGroup from "./Pembelajaran/Magang/SettingGroup";
import MagangReport from "./Pembelajaran/Magang/ReportMagang";
import MagangJadwal from "./Pembelajaran/Magang/JadwalMagang";
// ==================Pembelajaran Magang=====================

// ==================Pembelajaran Ujian=====================
import UjianSoal from "./Pembelajaran/Ujian/Soal";
import PenilaianSoal from "./Pembelajaran/Ujian/Penilaian";
import CekJawabanSoal from "./Pembelajaran/Ujian/CekJawaban";
// ==================Pembelajaran Ujian=====================

// ==================Beranda=====================
import Beranda from "./Beranda";
import BerandaProduk from "./Beranda/Produk";
import BerandaPembelian from "./Beranda/Pembelian";
import BerandaTagihan from "./Beranda/Tagihan";
import TagihanTryout from "./Beranda/Tagihan/tagihanTryOut";
import BerandaTryout from "./Beranda/Tryout";
import JawabanTryOut from "./Beranda/Tryout/jawabanTryOut";
import DanaPartisipasi from "./DanaPartisipasi";
import VerificationEmail from "./VerificationEmail";
import Payment from "./Payment";
import BerandaStatistik from "./Beranda/Statistik";
// ==================Beranda=====================

// ==================Profile Sekolah=====================
import PengaturanHakAkses from "./PengaturanHakAkses";
// ==================Profile Sekolah=====================

export default new Vuex.Store({
  modules: {
    login: () => import("./Login"),
    forgotPwd: () => import("./ForgotPassword"),
    profile: () => import("./Profile"),
    jurusan: () => import("./Pembelajaran/Jurusan"),
    materi: () => import("./Pembelajaran/Materi"),
    gurustaff: GuruStaff,
    pelajar: Pelajar,
    fileStorage: FileStorage,
    kartuPelajar: KartuPelajar,
    ruangkelas: RuangKelas,
    intro: Intro,
    roles: Roles,
    provinces: Provinces,
    cities: Cities,
    districts: Districts,
    majors: Majors,
    classrooms: Classrooms,
    pengumuman: Pengumuman,
    verificationEmail: VerificationEmail,
    sekolah: Sekolah,
    mapel: Mapel,
    jadwalPelajaran: JadwalPelajaran,
    pembelajaran: Pembelajaran,
    ujian: Ujian,
    jadwalUjian: JadwalUjian,
    tugas: Tugas,
    danaPartisipasi: DanaPartisipasi,
    beranda: Beranda,
    berandaProduk: BerandaProduk,
    berandaStatistik: BerandaStatistik,
    payment: Payment,
    berandaPembelian: BerandaPembelian,
    berandaTagihan: BerandaTagihan,
    tagihanTryout: TagihanTryout,
    berandaTryout: BerandaTryout,
    jawabanTryOut: JawabanTryOut,
    ujianSoal: UjianSoal,
    PenilaianSoal: PenilaianSoal,
    cekJawabanSoal: CekJawabanSoal,
    pengaturanHakAkses: PengaturanHakAkses,
    magang: Magang,
    magangSettingGroup: MagangSettingGroup,
    magangReport: MagangReport,
    magangJadwal: MagangJadwal,
  },
  state: {
    user: {},
    userToken: "",
    tokenKoperasi: {
      token: "",
      timeout: "",
    },
    tokenDanaPartisipasi: {
      token: "",
      timeout: "",
    },
    menuAddOns: {
      menu: [],
      last_check: false,
    },
    isDefaultPass: "",
    showsidebar: true,
    introState: {
      state1: [],
      state2: [],
      state1Done: false,
    },
    tutorial: {
      step_1: false,
      step_2: false,
      step_3: false,
      step_4: false,
      step_5: false,
      step_6: false,
    },
  },
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).map((item) => {
        state[item] = payload[item];
      });
    },
    logoutState(state) {
      state.user = {};
      state.userToken = "";
      state.tokenKoperasi = {
        token: "",
        timeout: "",
      };
      state.tokenDanaPartisipasi = {
        token: "",
        timeout: "",
      };
      state.introState = {
        state1: [],
        state2: [],
        state1Done: false,
      };
      state.tutorial = {
        step_1: false,
        step_2: false,
        step_3: false,
        step_4: false,
        step_5: false,
        step_6: false,
      };
      state.menuAddOns = {
        menu: [],
        last_check: "",
      };
    },
  },
  actions: {
    async checkMenuAddOns({ commit, state }) {
      // fungsi untuk cek menu add ons koperasi, dana partisipasi, dana sekolah, kewirausahaan
      // dicek setiap 60 menit atau setiap ada di menu beranda

      const { menuAddOns } = state;
      let timeRequest = 60;
      let checkAddOns = false;

      if (!menuAddOns.last_check || menuAddOns.last_check === "") {
        checkAddOns = true;
      } else {
        let timeNow = moment(new Date());
        let timeout = menuAddOns.last_check;
        if (timeNow.diff(timeout, "minutes") >= timeRequest) {
          checkAddOns = true;
        }
      }
      if (checkAddOns) {
        const result = await ApiGetRequest(`school/addons`);
        if (!result.error) {
          let dataMenuAddOns = _.where(result.data.data, {
            is_show: true,
          });

          commit("updateState", {
            menuAddOns: {
              menu: dataMenuAddOns,
              last_check: moment().format("YYYY-MM-DD HH:mm"),
            },
          });
        } else {
          commit("updateState", {
            menuAddOns: {
              menu: [],
              last_check: "",
            },
          });
        }
      }
    },

    async checkTokenKoperasi({ commit, state }) {
      let endPoint = `school/cooperative/klaspay-token`;
      const { tokenKoperasi } = state;
      let { token, timeout } = tokenKoperasi;
      let timeNow = moment(new Date());
      let available = true;

      timeout = moment(timeout);
      if (!token || token === "" || !tokenKoperasi || tokenKoperasi === "") {
        available = false;
      } else {
        // check setiap ada selisih waktu lebih dari 10 menit auto request token baru
        if (timeNow.diff(timeout, "minutes") > 10) {
          available = false;
        }
      }

      if (!available) {
        const result = await ApiGetRequest(endPoint);
        if (!result.error) {
          commit("updateState", {
            tokenKoperasi: {
              token: result.data.data.token,
              timeout: moment().format("YYYY-MM-DD HH:mm"),
            },
          });
        } else {
          commit("updateState", {
            tokenKoperasi: {
              token: "",
              timeout: "",
            },
          });
        }
      }

      return true;
    },

    async checkTokenDanaPartisipasi({ commit, state }) {
      let endPoint = `school/klaspay-token`;
      const { tokenDanaPartisipasi } = state;
      let { token, timeout } = tokenDanaPartisipasi;
      let timeNow = moment(new Date());
      let available = true;

      timeout = moment(timeout);
      if (
        !token ||
        token === "" ||
        !tokenDanaPartisipasi ||
        tokenDanaPartisipasi === ""
      ) {
        available = false;
      } else {
        // check setiap ada selisih waktu lebih dari 10 menit auto request token baru
        if (timeNow.diff(timeout, "minutes") > 10) {
          available = false;
        }
      }

    if (!available) {
        const result = await ApiGetRequest(endPoint);
        if (!result.error) {
          commit("updateState", {
            tokenDanaPartisipasi: {
              token: result.data.data.token,
              timeout: moment().format("YYYY-MM-DD HH:mm"),
            },
          });
        } else {
          commit("updateState", {
            tokenDanaPartisipasi: {
              token: "",
              timeout: "",
            },
          });
        }
      }

      return true;
    },

    async checkIntroState({ commit, state }) {
      let endPoint = `school/cms-init`;
      const { introState } = state;

      let flag = 0;
      if (introState.state1.length > 0) {
        flag++;
      } else {
        if (introState.state1Done) {
          flag++;
        }
      }

      let valIntro = _.values(introState.state2);
      valIntro = _.without(valIntro, false);

      flag += valIntro.length;

      if (flag < 7) {
        // STATE 1
        const resultState1 = await ApiGetRequest(endPoint, {
          state: 1,
        });
        if (!resultState1.error) {
          introState.state1 = resultState1.data.data[0].SuperAdmin;
        } else {
          introState.state1 = [];
        }

        // STATE 2
        const resultState2 = await ApiGetRequest(endPoint, {
          state: 2,
        });
        if (!resultState2.error) {
          introState.state2 = resultState2.data.data[0];
        } else {
          // auto logout supaya many request
          commit("logoutState");

          introState.state2 = [];
        }

        // SKIPPED STATE 1
        let statusState1 = false;
        if (introState.state1Done) {
          statusState1 = true;
        }

        let valIntroState2 = _.values(introState.state2);
        valIntroState2 = _.without(valIntroState2, false);
        if (valIntroState2.length > 0) {
          statusState1 = true;
        }

        commit("updateState", {
          introState: {
            state1: introState.state1,
            state2: introState.state2,
            state1Done: statusState1,
          },
        });
      }

      return true;
    },

    async logoutSystem({ commit }) {
      await ApiDeleteRequest(`logout`);
      commit("logoutState");
    },
  },
  plugins: [dataState],
});