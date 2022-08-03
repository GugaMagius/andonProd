<template>
  <div>
    <div class="corpo" v-if="dadosRecebidos">
      <div class="grid geral">
        <!-- VALORES DE ONTEM  -->

        <div class="col-5" :style="{
          height: '100vh',
          'padding-top': '1.5%',
          'padding-bottom': '1%',
          'padding-left': '3.5%',
          'padding-right': '3.5%',
          'background-color': fdoOntem,
        }">
          <!-- VALORES DE CADA TURNO -->
          <div class="grid painel">
            <div class="col-12 box titulo" :style="{
              'background-color': corOntem,
              color: txtOntem,
              height: '4.7vh',
              'font-size': '3vh',
              'font-weight': 'bold',
            }">
              Ontem
            </div>
            <div class="col-12">
              <div class="grid box">
                <div class="col-3 flex">
                  <div class="
                      h-full
                      flex
                      align-items-center
                      justify-content-center
                    ">
                    <h2>Meta:</h2>
                  </div>
                </div>
                <div class="col-9">
                  <div class="col-12 meta">
                    {{ prefixoMeta }} {{ ecoat ? perfMeta : metaP }}
                    {{ sufixoMeta }}
                  </div>
                </div>
              </div>
              <div>
                <table height="90vh" width="100%">
                  <tr>
                    <td></td>
                    <td id="grafOntem" width="84%">
                      <Graficos :Turno1m="
                        parseFloat(
                          arredondar(
                            ecoat
                              ? performance.Ontem.Turno1
                              : produzidos.Ontem.Turno1.media,
                            0
                          )
                        )
                      " :Turno2m="
  parseFloat(
    arredondar(
      ecoat
        ? performance.Ontem.Turno2
        : produzidos.Ontem.Turno2.media,
      0
    )
  )
" :Turno3m="
  parseFloat(
    arredondar(
      ecoat
        ? performance.Ontem.Turno3
        : produzidos.Ontem.Turno3.media,
      0
    )
  )
" :Meta="ecoat ? perfMeta.split(' ')[2] : valorMeta" ref="grafOntem" />
                    </td>
                    <td width="8%">
                      <div class="grid box"></div>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="grid">
                <div class="col-4 box">
                  <div class="grid"></div>
                  <div>
                    <div class="turno grid" :style="{ 'background-color': corOntem }">
                      <b>Turno 1</b>
                    </div>
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Hora'" :valorP="'prod'" :valorS="'perd'"
                      :cor="'lightgray'" :tamanho="tamTxtO" :ecoat="ecoat" :mesclar="!ecoat" :fixo="true" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'06'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['6'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['6'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'07'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['7'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['7'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'08'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['8'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['8'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'09'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['9'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['9'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'10'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['10'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['10'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'11'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['11'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['11'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'12'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['12'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['12'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'13'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['13'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['13'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'14'" :valorP="
                      arredondar(produzidos.Ontem.Turno1.horarios['14'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno1.horarios['14'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                  </div>
                </div>

                <div class="col-4 box">
                  <div class="turno grid" :style="{ 'background-color': corOntem }">
                    <b>Turno 2</b>
                  </div>
                  <div>
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Hora'" :valorP="'prod'" :valorS="'perd'"
                      :cor="'lightgray'" :tamanho="tamTxtO" :ecoat="ecoat" :mesclar="!ecoat" :fixo="true" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'15'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['15'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['15'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'16'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['16'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['16'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'17'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['17'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['17'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'18'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['18'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['18'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'19'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['19'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['19'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'20'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['20'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['20'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'21'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['21'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['21'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'22'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['22'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['22'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'23'" :valorP="
                      arredondar(produzidos.Ontem.Turno2.horarios['23'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno2.horarios['23'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                  </div>
                </div>
                <div class="col-4 box">
                  <div class="turno grid" :style="{ 'background-color': corOntem }">
                    <b>Turno 3</b>
                  </div>
                  <div>
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Hora'" :valorP="'prod'" :valorS="'perd'"
                      :cor="'lightgray'" :tamanho="tamTxtO" :ecoat="ecoat" :mesclar="!ecoat" :fixo="true" />

                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'23'" :valorP="
                      arredondar(produzidos.Ontem.Turno3.horarios['23'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno3.horarios['23'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat"
                      :mesclar="!ecoat" />

                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'00'" :valorP="
                      arredondar(produzidos.Ontem.Turno3.horarios['0'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno3.horarios['0'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'01'" :valorP="
                      arredondar(produzidos.Ontem.Turno3.horarios['1'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno3.horarios['1'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'02'" :valorP="
                      arredondar(produzidos.Ontem.Turno3.horarios['2'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno3.horarios['2'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'03'" :valorP="
                      arredondar(produzidos.Ontem.Turno3.horarios['3'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno3.horarios['3'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'04'" :valorP="
                      arredondar(produzidos.Ontem.Turno3.horarios['4'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno3.horarios['4'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                    <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'05'" :valorP="
                      arredondar(produzidos.Ontem.Turno3.horarios['5'], 0)
                    " :valorS="ecoat ? perdidos.Ontem.Turno3.horarios['5'] : 0" :metaP="metaP"
                      :metaS="produzidos.metaS" :tamanho="tamTxtO" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat"
                      :mesclar="!ecoat" />
                  </div>
                </div>
              </div>

              <div class="grid">
                <div class="col-4 box">
                  <!-- SOMA E MÉDIA-->
                  <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Méd.'"
                    :valorP="arredondar(produzidos.Ontem.Turno1.media, 1)"
                    :valorS="ecoat ? perdidos.Ontem.Turno1.media : 0" :tamanho="tamTxtO" :metaP="metaP"
                    :metaS="produzidos.metaS" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat" :mesclar="!ecoat"
                    :statusFdo="true" />
                  <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Total'"
                    :valorP="arredondar(produzidos.Ontem.Turno1.soma, 0)"
                    :valorS="ecoat ? perdidos.Ontem.Turno1.soma : 0" :metaS="produzidos.metaS" :turnoAtual="4"
                    :turnoDisp="1" :tamanho="tamTxtO" :ecoat="ecoat" :mesclar="!ecoat" />
                  <Display v-if="ecoat" :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Perf.'"
                    :valorP="arredondar(performance.Ontem.Turno1, 1)" :metaP="performance.meta" :sufixo="'%'"
                    :tamanho="tamTxtO" :mesclar="true" :turnoAtual="4" :turnoDisp="1" :ecoat="ecoat"
                    :statusFdo="true" />
                </div>
                <!-- SOMA E MÉDIA-->
                <div class="col-4 box">
                  <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Méd.'"
                    :valorP="arredondar(produzidos.Ontem.Turno2.media, 1)"
                    :valorS="ecoat ? perdidos.Ontem.Turno2.media : 0" :tamanho="tamTxtO" :metaP="metaP"
                    :metaS="produzidos.metaS" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat" :mesclar="!ecoat"
                    :statusFdo="true" />
                  <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Total'"
                    :valorP="arredondar(produzidos.Ontem.Turno2.soma, 0)"
                    :valorS="ecoat ? perdidos.Ontem.Turno2.soma : 0" :metaS="produzidos.metaS" :turnoAtual="4"
                    :turnoDisp="2" :tamanho="tamTxtO" :ecoat="ecoat" :mesclar="!ecoat" />
                  <Display v-if="ecoat" :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Perf.'"
                    :valorP="arredondar(performance.Ontem.Turno2, 1)" :metaP="performance.meta" :sufixo="'%'"
                    :tamanho="tamTxtO" :mesclar="true" :turnoAtual="4" :turnoDisp="2" :ecoat="ecoat"
                    :statusFdo="true" />
                </div>
                <!-- SOMA E MÉDIA-->
                <div class="col-4 box">
                  <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Méd.'"
                    :valorP="arredondar(produzidos.Ontem.Turno3.media, 1)"
                    :valorS="ecoat ? perdidos.Ontem.Turno3.media : 0" :tamanho="tamTxtO" :metaP="metaP"
                    :metaS="produzidos.metaS" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat" :mesclar="!ecoat"
                    :statusFdo="true" />
                  <Display :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Total'"
                    :valorP="arredondar(produzidos.Ontem.Turno3.soma, 0)"
                    :valorS="ecoat ? perdidos.Ontem.Turno3.soma : 0" :metaS="produzidos.metaS" :turnoAtual="4"
                    :turnoDisp="3" :tamanho="tamTxtO" :ecoat="ecoat" :mesclar="!ecoat" />
                  <Display v-if="ecoat" :corFundoR="corOntem" :txtCor="txtOntem" :tag="'Perf.'"
                    :valorP="arredondar(performance.Ontem.Turno3, 1)" :metaP="performance.meta" :sufixo="'%'"
                    :tamanho="2.7" :mesclar="true" :turnoAtual="4" :turnoDisp="3" :ecoat="ecoat" :statusFdo="true" />
                </div>
              </div>

              <div class="grid">
                <div class="col-12 box">
                  <div class="grid conteudo">
                    <div class="col-2 mesclVert" :style="{
                      'background-color': corOntem,
                      color: txtOntem,
                      'font-size': '2.2vh',
                    }">
                      <b>Total dia</b>
                    </div>
                    <div class="col-10 totalizador">
                      <table :style="{ width: '100%', margin: '0', padding: '0' }">
                        <th colspan="2" :style="{
                          'background-color': corOntem,
                          color: txtOntem,
                          margin: '0',
                          padding: '0',
                          'font-size': '2vh',
                        }">
                          Média {{ unidMedia }}
                        </th>
                        <th colspan="2" :style="{
                          'background-color': corOntem,
                          color: txtOntem,
                          margin: '0',
                          padding: '0',
                          'font-size': '2vh',
                        }">
                          Quantidade {{ unidQtd }}
                        </th>
                        <th v-if="ecoat" rowspan="2" :style="{
                          'background-color': corOntem,
                          color: txtOntem,
                          margin: '0',
                          padding: '0',
                          'font-size': '2vh',
                        }">
                          Performance
                        </th>
                        <tr v-if="ecoat">
                          <td :style="{
                            'background-color': corOntem,
                            color: txtOntem,
                            margin: '0',
                            padding: '0',
                          }">
                            Prod.
                          </td>
                          <td :style="{
                            'background-color': corOntem,
                            color: txtOntem,
                            margin: '0',
                            padding: '0',
                          }">
                            Perd.
                          </td>
                          <td :style="{
                            'background-color': corOntem,
                            color: txtOntem,
                            margin: '0',
                            padding: '0',
                          }">
                            Prod.
                          </td>
                          <td :style="{
                            'background-color': corOntem,
                            color: txtOntem,
                            margin: '0',
                            padding: '0',
                          }">
                            Perd.
                          </td>
                          <td :style="{
                            'background-color': corOntem,
                            color: txtOntem,
                            margin: '0',
                            padding: '0',
                          }"></td>
                        </tr>
                        <tr>
                          <td v-if="!ecoat" colspan="2" :style="{
                            margin: '0',
                            padding: '0',
                            'font-size': '2.1vh',
                            color: 'white',
                            'background-color': atingiuMetaOn,
                          }">
                            <b>{{
                                arredondar(produzidos.Ontem.mediaDia, 1)
                            }}</b>
                          </td>
                          <td v-if="ecoat" :style="{
                            margin: '0',
                            padding: '0',
                            'font-size': '2.1vh',
                          }" :class="[
  this.perdidos.Ontem.mediaDia >=
    this.metaP.split(' ')[2]
    ? 'fonteOK'
    : 'fonteNOK',
]">
                            <b>{{
                                arredondar(produzidos.Ontem.mediaDia, 1)
                            }}</b>
                          </td>
                          <td v-if="ecoat" :style="{
                            margin: '0',
                            padding: '0',
                            'font-size': '2.1vh',
                          }" :class="[
  this.perdidos.Ontem.mediaDia >=
    this.metaP.split(' ')[2]
    ? 'fonteOK'
    : 'fonteNOK',
]">
                            <b>{{ arredondar(perdidos.Ontem.mediaDia, 1) }}</b>
                          </td>
                          <td v-if="!ecoat" colspan="2" :style="{
                            margin: '0',
                            padding: '0',
                            'font-size': '2.1vh',
                          }">
                            <b>{{ arredondar(produzidos.Ontem.somaDia, 1) }}</b>
                          </td>
                          <td v-if="ecoat" :style="{
                            margin: '0',
                            padding: '0',
                            'font-size': '2.1vh',
                          }" :class="[
  this.perdidos.Ontem.somaDia >=
    this.metaP.split(' ')[2]
    ? 'fonteOK'
    : 'fonteNOK',
]">
                            <b>{{ arredondar(produzidos.Ontem.somaDia, 1) }}</b>
                          </td>
                          <td v-if="ecoat" :style="{
                            margin: '0',
                            padding: '0',
                            'font-size': '2.1vh',
                          }" :class="[
  this.perdidos.Ontem.somaDia >=
    this.metaP.split(' ')[2]
    ? 'fonteOK'
    : 'fonteNOK',
]">
                            <b>{{ arredondar(perdidos.Ontem.somaDia, 0) }}</b>
                          </td>
                          <td v-if="ecoat" :style="{
                            margin: '0',
                            padding: '0',
                            'font-size': '2.1vh',
                          }" :class="[
  this.performance.Ontem.total >=
    this.perfMeta.split(' ')[2]
    ? 'fdoOK'
    : 'fdoNOK',
]">
                            <b>{{ arredondar(performance.Ontem.total, 1) }}%</b>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- VALORES DE HOJE  -->
        <div class="col-7" :style="{
          'padding-top': '1.5%',
          'padding-bottom': '1%',
          'padding-left': '6%',
          'padding-right': '6%',
          'background-color': fdoHoje,
        }">
          <div class="borda">
            <!-- VALORES DE CADA TURNO -->
            <div class="grid painel">
              <div class="col-12 box borda titulo" :style="{
                'background-color': corHoje,
                color: txtHoje,
                'font-size': '4vh',
              }">
                <b>Hoje</b>
              </div>
              <div class="col-12" style="
                   {
                    width: '100%';
                  }
                ">
                <div>
                  <table height="110vh" width="100%">
                    <tr>
                      <td></td>
                      <td id="grafHoje" height="20%" width="70%">
                        <Graficos :Turno1m="
                          parseFloat(
                            arredondar(
                              ecoat
                                ? performance.Hoje.Turno1
                                : produzidos.Hoje.Turno1.media,
                              0
                            )
                          )
                        " :Turno2m="
  parseFloat(
    arredondar(
      ecoat
        ? performance.Hoje.Turno2
        : produzidos.Hoje.Turno2.media,
      0
    )
  )
" :Turno3m="
  parseFloat(
    arredondar(
      ecoat
        ? performance.Hoje.Turno3
        : produzidos.Hoje.Turno3.media,
      0
    )
  )
" :Meta="ecoat ? perfMeta.split(' ')[2] : valorMeta" ref="grafHoje" />
                      </td>
                      <td width="15%" style="
                           {
                            padding: '5%';
                          }
                        ">
                        <div class="grid box" style="
                             {
                              margin: '20px';
                            }
                          ">
                          <div class="pulsar">
                            <div class="col-12 semEspaco metaHoje">Meta:</div>
                            <div class="col-12 semEspaco valMeta" v-if="prefixoMeta">
                              {{ prefixoMeta }}
                            </div>
                            <div class="col-12 semEspaco valMeta" display="inline">
                              <span :style="{ color: atingiuMetaHj }">
                                {{ ecoat ? perfMeta : metaP }}
                              </span>
                              <span v-if="sufixoMeta">
                                {{ sufixoMeta }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="grid" style="
                     {
                      width: '100%';
                    }
                  ">
                  <div class="col-12"></div>
                </div>
                <div class="grid">
                  <div class="col-4 box">
                    <div class="turno grid" :style="{ 'background-color': corHoje }">
                      <b>Turno 1</b>
                    </div>
                    <div>
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Hora'" :valorP="'prod'" :valorS="'perd'"
                        :cor="'lightgray'" :tamanho="2.7" :ecoat="ecoat" :mesclar="!ecoat" :fixo="true" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'06'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['6'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno1.horarios['6'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'07'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['7'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno1.horarios['7'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'08'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['8'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno1.horarios['8'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'09'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['9'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno1.horarios['9'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'10'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['10'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno1.horarios['10'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'11'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['11'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno1.horarios['11'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'12'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['12'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno1.horarios['12'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'13'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['13'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno1.horarios['13'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'14'" :valorP="
                        arredondar(produzidos.Hoje.Turno1.horarios['14'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno1.horarios['14'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="1"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                    </div>
                  </div>

                  <div class="col-4 box">
                    <div class="turno grid" :style="{ 'background-color': corHoje, color: txtHoje }">
                      <b>Turno 2</b>
                    </div>
                    <div>
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Hora'" :valorP="'prod'" :valorS="'perd'"
                        :cor="'lightgray'" :tamanho="2.7" :ecoat="ecoat" :mesclar="!ecoat" :fixo="true" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'15'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['15'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno2.horarios['15'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'16'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['16'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno2.horarios['16'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'17'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['17'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno2.horarios['17'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'18'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['18'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno2.horarios['18'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'19'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['19'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno2.horarios['19'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'20'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['20'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno2.horarios['20'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'21'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['21'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno2.horarios['21'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'22'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['22'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno1.horarios['22'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'23'" :valorP="
                        arredondar(produzidos.Hoje.Turno2.horarios['23'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno2.horarios['23'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="2"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                    </div>
                  </div>
                  <div class="col-4 box">
                    <div class="turno grid" :style="{ 'background-color': corHoje }">
                      <b>Turno 3</b>
                    </div>
                    <div>
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Hora'" :valorP="'prod'" :valorS="'perd'"
                        :cor="'lightgray'" :tamanho="2.7" :ecoat="ecoat" :mesclar="!ecoat" :fixo="true" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'23'" :valorP="
                        arredondar(produzidos.Hoje.Turno3.horarios['23'], 0)
                      " :valorS="
                        ecoat ? perdidos.Hoje.Turno3.horarios['23'] : 0
                      " :metaP="metaP" :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="3"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'00'" :valorP="
                        arredondar(produzidos.Hoje.Turno3.horarios['0'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno3.horarios['0'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="3"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'01'" :valorP="
                        arredondar(produzidos.Hoje.Turno3.horarios['1'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno3.horarios['1'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="3"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'02'" :valorP="
                        arredondar(produzidos.Hoje.Turno3.horarios['2'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno3.horarios['2'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="3"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'03'" :valorP="
                        arredondar(produzidos.Hoje.Turno3.horarios['3'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno3.horarios['3'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="3"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'04'" :valorP="
                        arredondar(produzidos.Hoje.Turno3.horarios['4'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno3.horarios['4'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="3"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                      <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'05'" :valorP="
                        arredondar(produzidos.Hoje.Turno3.horarios['5'], 0)
                      " :valorS="ecoat ? perdidos.Hoje.Turno3.horarios['5'] : 0" :metaP="metaP"
                        :metaS="produzidos.metaS" :tamanho="tamTxtH" :turnoAtual="produzidos.turno" :turnoDisp="3"
                        :ecoat="ecoat" :mesclar="!ecoat" />
                    </div>
                  </div>
                </div>

                <div class="grid">
                  <div class="col-4 box">
                    <!-- SOMA E MÉDIA-->
                    <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Méd.'"
                      :valorP="arredondar(produzidos.Hoje.Turno1.media, 1)"
                      :valorS="ecoat ? perdidos.Hoje.Turno1.media : 0" :tamanho="3" :metaP="metaP"
                      :metaS="produzidos.metaS" :turnoAtual="produzidos.turno" :turnoDisp="1" :ecoat="ecoat"
                      :mesclar="!ecoat" :fixo="true" :statusFdo="true" />
                    <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Total'"
                      :valorP="arredondar(produzidos.Hoje.Turno1.soma, 0)"
                      :valorS="ecoat ? perdidos.Hoje.Turno1.soma : 0" :metaS="produzidos.metaS"
                      :turnoAtual="produzidos.turno" :turnoDisp="1" :tamanho="3" :ecoat="ecoat" :mesclar="!ecoat"
                      :fixo="true" />
                    <Display v-if="ecoat" :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Perf.'"
                      :valorP="arredondar(performance.Hoje.Turno1, 1)" :metaP="performance.meta" :sufixo="'%'"
                      :tamanho="3" :mesclar="true" :turnoAtual="produzidos.turno" :turnoDisp="1" :ecoat="ecoat"
                      :fixo="true" :statusFdo="true" />
                  </div>
                  <!-- SOMA E MÉDIA-->
                  <div class="col-4 box">
                    <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Méd.'"
                      :valorP="arredondar(produzidos.Hoje.Turno2.media, 1)"
                      :valorS="ecoat ? perdidos.Hoje.Turno2.media : 0" :tamanho="3" :metaP="metaP"
                      :metaS="produzidos.metaS" :turnoAtual="produzidos.turno" :turnoDisp="2" :ecoat="ecoat"
                      :mesclar="!ecoat" :fixo="true" :statusFdo="true" />
                    <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Total'"
                      :valorP="arredondar(produzidos.Hoje.Turno2.soma, 0)"
                      :valorS="ecoat ? perdidos.Hoje.Turno2.soma : 0" :metaS="produzidos.metaS"
                      :turnoAtual="produzidos.turno" :turnoDisp="2" :tamanho="3" :ecoat="ecoat" :mesclar="!ecoat"
                      :fixo="true" />
                    <Display v-if="ecoat" :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Perf.'"
                      :valorP="arredondar(performance.Hoje.Turno2, 1)" :metaP="performance.meta" :sufixo="'%'"
                      :tamanho="3" :mesclar="true" :turnoAtual="produzidos.turno" :turnoDisp="2" :ecoat="ecoat"
                      :fixo="true" :statusFdo="true" />
                  </div>
                  <!-- SOMA E MÉDIA-->
                  <div class="col-4 box">
                    <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Méd.'"
                      :valorP="arredondar(produzidos.Hoje.Turno3.media, 1)"
                      :valorS="ecoat ? perdidos.Hoje.Turno3.media : 0" :tamanho="3" :metaP="metaP"
                      :metaS="produzidos.metaS" :turnoAtual="produzidos.turno" :turnoDisp="3" :ecoat="ecoat"
                      :mesclar="!ecoat" :fixo="true" :statusFdo="true" />
                    <Display :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Total'"
                      :valorP="arredondar(produzidos.Hoje.Turno3.soma, 0)"
                      :valorS="ecoat ? perdidos.Hoje.Turno3.soma : 0" :metaS="produzidos.metaS"
                      :turnoAtual="produzidos.turno" :turnoDisp="3" :tamanho="3" :ecoat="ecoat" :mesclar="!ecoat"
                      :fixo="true" />
                    <Display v-if="ecoat" :corFundoR="corHoje" :txtCor="txtHoje" :tag="'Perf.'"
                      :valorP="arredondar(performance.Hoje.Turno3, 1)" :metaP="performance.meta" :sufixo="'%'"
                      :tamanho="3" :mesclar="true" :turnoAtual="produzidos.turno" :turnoDisp="3" :ecoat="ecoat"
                      :fixo="true" :statusFdo="true" />
                  </div>
                </div>
                <div class="grid">
                  <div class="col-12 box">
                    <div class="grid conteudo">
                      <div class="col-2 mesclVert fonteMaior" :style="{ 'background-color': corHoje, color: txtHoje }">
                        <b>Total dia</b>
                      </div>
                      <div class="col-10 totalizador">
                        <table :style="{ width: '100%', margin: '0', padding: '0' }">
                          <th colspan="2" :style="{
                            'background-color': corHoje,
                            color: txtHoje,
                            margin: '0',
                            padding: '0',
                            'font-size': '2.2vh',
                          }">
                            Média {{ unidMedia }}
                          </th>
                          <th colspan="2" :style="{
                            'background-color': corHoje,
                            color: txtHoje,
                            margin: '0',
                            padding: '0',
                            'font-size': '2.2vh',
                          }">
                            Quantidade {{ unidQtd }}
                          </th>
                          <th v-if="ecoat" rowspan="2" :style="{
                            'background-color': corHoje,
                            color: txtHoje,
                            margin: '0',
                            padding: '0',
                            'font-size': '2.2vh',
                          }">
                            Performance
                          </th>
                          <tr v-if="ecoat">
                            <td :style="{
                              'background-color': corHoje,
                              color: txtHoje,
                              margin: '0',
                              padding: '0',
                            }">
                              Prod.
                            </td>
                            <td :style="{
                              'background-color': corHoje,
                              color: txtHoje,
                              margin: '0',
                              padding: '0',
                            }">
                              Perd.
                            </td>
                            <td :style="{
                              'background-color': corHoje,
                              color: txtHoje,
                              margin: '0',
                              padding: '0',
                            }">
                              Prod.
                            </td>
                            <td :style="{
                              'background-color': corHoje,
                              color: txtHoje,
                              margin: '0',
                              padding: '0',
                            }">
                              Perd.
                            </td>
                            <td :style="{
                              'background-color': corHoje,
                              color: txtHoje,
                              margin: '0',
                              padding: '0',
                            }"></td>
                          </tr>
                          <tr>
                            <td v-if="!ecoat" colspan="2" class="fonteMaior" :style="{
                              margin: '0',
                              padding: '0',
                              color: 'white',
                              'background-color': atingiuMetaHj,
                            }">
                              <b>{{
                              arredondar(produzidos.Hoje.mediaDia, 1)
                              }}</b>
                            </td>
                            <td v-if="ecoat" class="fonteMaior" :style="{ margin: '0', padding: '0' }" :class="[
                              this.perdidos.Hoje.mediaDia >=
                              this.metaP.split(' ')[2]
                                ? 'fonteOK'
                                : 'fonteNOK',
                            ]">
                              <b>{{
                              arredondar(produzidos.Hoje.mediaDia, 1)
                              }}</b>
                            </td>
                            <td v-if="ecoat" class="fonteMaior" :style="{ margin: '0', padding: '0' }" :class="[
                              this.perdidos.Hoje.mediaDia >=
                              this.metaP.split(' ')[2]
                                ? 'fonteOK'
                                : 'fonteNOK',
                            ]">
                              <b>{{ arredondar(perdidos.Hoje.mediaDia, 1) }}</b>
                            </td>
                            <td v-if="!ecoat" colspan="2" class="fonteMaior" :style="{ margin: '0', padding: '0' }">
                              <b>{{
                              arredondar(produzidos.Hoje.somaDia, 1)
                              }}</b>
                            </td>
                            <td v-if="ecoat" class="fonteMaior" :style="{ margin: '0', padding: '0' }" :class="[
                              this.perdidos.Hoje.somaDia >=
                              this.metaP.split(' ')[2]
                                ? 'fonteOK'
                                : 'fonteNOK',
                            ]">
                              <b>{{
                              arredondar(produzidos.Hoje.somaDia, 1)
                              }}</b>
                            </td>
                            <td v-if="ecoat" class="fonteMaior" :style="{ margin: '0', padding: '0' }" :class="[
                              this.perdidos.Hoje.somaDia >=
                              this.metaP.split(' ')[2]
                                ? 'fonteOK'
                                : 'fonteNOK',
                            ]">
                              <b>{{ arredondar(perdidos.Hoje.somaDia, 0) }}</b>
                            </td>
                            <td v-if="ecoat" class="fonteMaior" :style="{
                              margin: '0',
                              padding: '0',
                            }" :class="[
                              this.performance.Hoje.total >=
                              this.perfMeta.split(' ')[2]
                                ? 'fdoOK'
                                : 'fdoNOK',
                            ]">
                              <b>{{ arredondar(performance.Hoje.total, 1) }}%</b>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Graficos from "../components/Graficos.vue";
import Display from "../components/Cdisplay.vue";

export default {
  components: {
    Graficos,
    Display,
  },
  props: {
    dadosServer: Object,
    ecoat: Boolean,
    unidMedia: String,
    unidQtd: String,
    prefixoMeta: String,
    sufixoMeta: String,
    metaP: String,
    perfMeta: String,
    performance: Object,
    setor: String,
    listaCTs: Object

  },

  created() {
    //window.addEventListener("resize", this.myEventHandler);
  },

  mounted() {
    this.$socket.emit("dadosSolicitados", "Solicitando atualização de dados");

    if (this.dadosServer[`dados${this.setor}`] != undefined) {
      this.produzidos = this.dadosServer[`dados${this.setor}`];
      this.produzidos.metaP = this.dadosServer.metas[`metaP_${this.setor}`]
      this.produzidos.turno = this.dadosServer.turno
    }

    setTimeout(this.pegaLargGraf, 1000);
    this.valorMeta = this.produzidos.metaP.split(" ")[2];
  },
  watch: {
    dadosServer() {
      if (this.dadosServer[`dados${this.setor}`] != undefined) {
        this.produzidos = this.dadosServer[`dados${this.setor}`];
        this.produzidos.metaP = this.dadosServer.metas[`metaP_${this.setor}`];
        this.produzidos.turno = this.dadosServer.turno
        this.dadosRecebidos = true;
      }
    },
    dadosRecebidos() {
      setTimeout(this.pegaLargGraf, 1000);
    },
    produzidos() {
      this.atualizaDados();
    },
    perdidos() {
      this.atualizaDados();
    },
  },

  methods: {
    atualizaDados() {
      // sinaliza dados recebidos e valor da meta
      try {
        if (this.produzidos != undefined) {
          if (this.dadosRecebidos === false) {
            this.valorMeta = this.produzidos.metaP.split(" ")[2];
          }
          this.dadosRecebidos = true;
        }
      } catch (err) {
        console.log("FALHA AO ATUALIZAR DADOS: ", err);
      }
      // verifica se atingiu a meta
      try {
        if (this.ecoat) {
          if (eval(`${this.performance.Hoje.total} ${this.perfMeta}`)) {
            this.atingiuMetaHj = this.corOK;
          } else {
            this.atingiuMetaHj = this.corNOK;
          }
          if (eval(`${this.performance.Ontem.total} ${this.perfMeta}`)) {
            this.atingiuMetaOn = this.corOK;
          } else {
            this.atingiuMetaOn = this.corNOK;
          }
        } else {
          if (eval(`${this.produzidos.Hoje.mediaDia} ${this.metaP}`)) {
            this.atingiuMetaHj = this.corOK;
          } else {
            this.atingiuMetaHj = this.corNOK;
          }
          if (eval(`${this.produzidos.Ontem.mediaDia} ${this.metaP}`)) {
            this.atingiuMetaOn = this.corOK;
          } else {
            this.atingiuMetaOn = this.corNOK;
          }
        }
      } catch (err) {
        console.log("Erro ao calcular meta ", err);
      }
    },

    arredondar(variavel, qtd) {
      // função para fazer arredondamento e testar, se não tiver valor ou não for possível arredondar, a função irá retornar "0"
      try {
        return isNaN(parseFloat(variavel).toFixed(qtd))
          ? 0
          : parseFloat(variavel).toFixed(qtd);
      } catch (err) {
        return 0;
      }
    },

    pegaLargGraf() {
      let largDivGrafH = document.getElementById("grafHoje").clientWidth;
      let altDivGrafH = document.getElementById("grafHoje").clientHeight;
      this.$refs.grafHoje.ajustaTamanho(altDivGrafH, largDivGrafH);

      let largDivGrafO = document.getElementById("grafOntem").clientWidth;
      let altDivGrafO = document.getElementById("grafOntem").clientHeight;
      this.$refs.grafOntem.ajustaTamanho(altDivGrafO, largDivGrafO);
    },
  },

  data() {
    return {
      atingiuMetaHj: "",
      atingiuMetaOn: "",
      produzidos: {},
      perdidos: {},
      alturaAtual: "",
      corOK: "#42A500",
      corNOK: "#ff0000",
      metaPerfHoje: false,
      metaPerfOntem: false,
      dadosRecebidos: false,
      corOntem: "var(--surface-200)",
      corHoje: "var(--surface-300)",
      txtOntem: "var(--surface-700)",
      txtHoje: "var(--surface-900)",
      tamTxtO: 2.5,
      tamTxtH: 2.7,
      fdoOntem: "var(--surface-50)",
      fdoHoje: "var(--surface-0)"
    };
  },
};
</script>

<style scoped>
.pulsar {
  animation: blink 0.8s linear infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.fonteOK {
  color: #42a500;
}

.fonteNOK {
  color: #ff0000;
}

.fdoOK {
  background-color: #42a500;
  color: white;
}

.fdoNOK {
  background-color: #ff0000;
  color: white;
}

.mesclVert {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-top: 0px;
  margin-bottom: 0px;
}

.borda {
  border-style: solid;
  border-width: 0.4rem;
  border-color: var(--primary-color);
  padding: 2%;
  padding-bottom: 0;
}

.totalizador {
  padding: 0;
  display: table;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.conteudo {
  height: 100%;
}

.colunas {
  display: table;
  margin-top: 0px;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.fonteMaior {
  font-size: 2.5vh;
}

.painel {
  height: 100%;
}

.grid {
  margin-top: 0px;
  margin-bottom: 0px;
  display: flex;
  justify-content: center;
}

.meta {
  padding: 1.3%;
  font-size: 3vh;
  font-weight: 700;
}

.valMeta {
  font-size: 2.6vh;
  font-weight: 500;
}

.col-4 {
  padding: 2%;
}

.col-7 {
  height: 100vh;
}

.turno {
  margin-top: 0;
  margin-bottom: -1vh;
  padding: 1vh;
  font-size: 2.5vh;
}

.metaHoje {
  font-size: 2.7vh;
  font-weight: 700;
  margin: 0;
  padding: 0;
}

.semEspaco {
  margin: 0.2vh;
  padding: 0;
}

.grafico {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  padding-bottom: auto;
  margin-top: -0.5vh;
}

.geral {
  padding-top: 0%;
  padding-bottom: 0%;
}

.quadro {
  background-color: aqua;
  display: table-cell;
  height: 100%;
  width: 100%;
}

.titulo {
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-top: -1vh;
  margin-bottom: -1vh;
}

.box {
  border-radius: 0px;
  margin-bottom: 1.5%;

  padding-bottom: 0rem;
  padding-top: 0rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.span {
  margin: 0;
  padding: 0;
}
</style>