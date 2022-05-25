<template>
    <div :class='{ pc: isPC, horizontal: horizontal }'>

        <div class="price_box">
            <div class="price_left">
            <span :class="isNewP(data)">{{ data.newP }}<em class="arrowbold"></em></span>
            <p
                v-if="isOks(data.rate)"
                :class="isOks(util.accSub(data.newP, data.preclose))"
            >
                <i>+</i>{{ util.accSub(data.newP, data.preclose)
                }}<label v-if="data.rate">{{ data.rate.toFixed(2) }}%</label>
            </p>
            </div>
            <div class="price_right">
            <ul>
                <li>今开&nbsp;<span :class="isOpen(data)">{{ data.open }}</span></li>
                <li>最高&nbsp;<span :class="isHigh(data)">{{ data.high }}</span></li>
                <li>昨收&nbsp;<span :class="isPreclose(data)">{{ data.preclose }}</span></li>
                <li>最低&nbsp;<span :class="isLow(data)">{{ data.low }}</span></li>
            </ul>
            </div>
        </div>

        <!-- <div class="test">{{(product.lastPrice?product.lastPrice.dtime:0)*1000 | formatTime('HH:mm:ss')}}</div> -->
        <div class='tv-head' :style='{ visibility: horizontal ? "hidden": "visible"}'>
            <div v-if='isShowTab' v-show='!selected' ref='tabsWrap' class='tabs-wrap'>
                <van-tabs
                    ref='tabs'
                    v-model='activeTab'
                    :before-change='onBeforeChange'
                    class='tabs'
                    line-height='0'
                    line-width='0'
                    @change='tabChange'
                >
                    <template>
                        <van-tab v-for='(item,i) in candleKTypeList.slice(0,moreKTypesIndex)' :key='i' :name='item.ktype' :title='item.title' />

                        <van-tab name='moreKTypes'>
                            <div slot='title' class='other-time-tab' :class='{ opened: moreTimeIsOpened }'>
                                {{ moreKType.title || $t('chart.day') }}
                            </div>
                        </van-tab>
                        
                    </template>
                </van-tabs>

                <div class='more-time' v-show='moreTimeIsOpened'>
                    <div class='options van-hairline--surround'>
                        <div
                            v-for='(item,i) in candleKTypeList.slice(moreKTypesIndex)'
                            :key='i'
                            class='option'
                            :class='{ active: moreKType.ktype === item.ktype }'
                            @click='onClickMoreTime(item)'
                        >
                        {{ item.title }}
                        </div>
                    </div>
                    <div
                        v-show='moreTimeIsOpened'
                        class='mask'
                        @click.stop='moreTimeIsOpened = false'
                        @touchmove.stop='moreTimeIsOpened = false'
                    ></div>
                </div>



                <div class='flex-right'>
                    <van-dropdown-menu class='kIcon-wrap' :style='{ opacity: activeTab ==="timeSharing" ? 0: 1 }'>
                        <van-dropdown-item ref='klineType' v-model='klineType' :title="$t('indicator')">
                            <span slot='title'>
                                <KIcon class='kIcon' :value='klineTypeIndex' />
                            </span>
                            <van-cell
                                v-for='(item, i) in klineTypeList'
                                :key='item.name'
                                :class="{ 'mainColor':klineType===item.value }"
                                is-link
                                @click='setKlineType(item)'
                            >
                                <template #title>
                                    <span class='custom-title'>
                                        <KIcon class='kIcon' :value='i+1' />
                                        {{ item['title_'+lang] }}
                                    </span>
                                </template>
                                <template #right-icon>
                                    <van-icon v-if='klineType===item.value' class='klineTypeRightIcon' name='success' />
                                </template>
                            </van-cell>
                        </van-dropdown-item>
                    </van-dropdown-menu>

                    <!-- <van-loading v-if='loading' class='loadingIcon' color='#1846d6' size='18px' /> -->

                    <div class='setting' @click='settingStatus = !settingStatus'>
                        <van-icon class='icon' name='setting-o' />
                        <div v-show='settingStatus' class='content van-hairline--surround' @click.stop>
                            <template v-for='item in lineList'>
                                <!-- 仅外汇显示：买卖五档和成交记录选项 -->
                                <template v-if='product.market_id === 8 || (product.market_id !== 8 && !["stalls", "deal"].includes(item.value))'>
                                    <van-checkbox
                                        v-if="(item.value === 'position' && groupGet && groupGet.id) || item.value !== 'position'"
                                        :key='item.value'
                                        v-model='linesData[item.value].status'
                                        class='item'
                                        :class='{ active: linesData[item.value].status }'
                                        :disabled='activeTab === "timeSharing" && !["stalls", "deal"].includes(item.value)'
                                        icon-size='.18rem'
                                        @change='bool => toogleLine(item.value, bool)'
                                    >
                                    {{ item.title }}
                                    </van-checkbox>
                                </template>
                            </template>
                        </div>
                        <div
                            v-show='settingStatus'
                            class='mask'
                            @click.stop='settingStatus = false'
                            @touchmove.stop='settingStatus = false'
                        >
                        </div>
                    </div>
                </div>
            </div>

            <!-- 鼠标放图标上改变价格区分分时和K图开始 -->
            <template v-if='selected'>
                <div v-if='activeTab === "timeSharing"' class='selected-data'>
                    <div class='time'>
                        <span>{{ selectedDataForTS.time * 1000 | formatTime('YYYY/MM/DD') }} {{ selectedDataForTS.time * 1000 | formatTime('HH:mm:ss') }}</span>
                    </div>
                    <div class='content'>
                        <div class='item'>
                            <div>
                                <span>{{ $t('trade.priceLabel') }}</span>
                                <span class='item-value'>{{ selectedDataForTS.close }}</span>
                            </div>
                        </div>
                        <div class='item'>
                            <div>
                                <span>{{ $t('chart.diffPrice') }}</span>
                                <span
                                    v-if='product.lastPrice && product.lastPrice.preclose'
                                    class='item-value'
                                    :style='{ color: getColorStr(selectedDataForTS.close, Number(product.lastPrice.preclose)) }'
                                >
                                    {{ selectedDataForTS.diff | filterNumberSign }}
                                </span>
                            </div>
                        </div>
                        <div class='item'>
                            <div>
                                <span>{{ $t('chart.quoteChange') }}</span>
                                <span
                                    v-if='product.lastPrice && product.lastPrice.preclose'
                                    class='item-value'
                                    :style='{ color: getColorStr(selectedDataForTS.close, Number(product.lastPrice.preclose)) }'
                                >
                                    <template v-if='selectedDataForTS.diffPercent * 1 === 0'>
                                        {{ (selectedDataForTS.diff > 0 ? '+' : (selectedDataForTS.diff < 0 ? '-' : '')) + selectedDataForTS.diffPercent }}%
                                    </template>

                                    <template v-else>
                                        {{ selectedDataForTS.diffPercent | filterNumberSign }}%
                                    </template>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class='selected-data'>
                    <div class='time'>
                        <span>{{ selectedBar.dateStr }}</span>
                        <span>{{ selectedBar.timeStr }}</span>
                    </div>
                    <div class='content'>
                        <template>
                            <div class='item'>
                                <div v-show='selectedBar.open' class='open'>
                                    {{ $t('chart.open') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.open }'
                                    >
                                        {{ selectedBar.open }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.close' class='close'>
                                    {{ $t('chart.close') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.close }'
                                    >
                                        {{ selectedBar.close }}
                                    </span>
                                </div>
                            </div>

                            <div class='item'>
                                <div v-show='selectedBar.high' class='high'>
                                    {{ $t('chart.high') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.high }'
                                    >
                                        {{ selectedBar.high }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.low' class='low'>
                                    {{ $t('chart.low') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.low }'
                                    >
                                        {{ selectedBar.low }}
                                    </span>
                                </div>
                            </div>
                            <div class='item'>
                                <div v-show='selectedBar.diff' class='diff'>
                                    {{ $t('chart.diffPrice') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.diff }'
                                    >
                                        {{ ( selectedBar.diff > 0 ? '+' : '' ) + selectedBar.diff }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.diffPercent' class='diff-percent'>
                                    {{ $t('chart.quoteChange') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.diffPercent }'
                                    >
                                        <template v-if='selectedBar.diffPercent * 1 === 0'>
                                            {{ (selectedBar.diff > 0 ? '+' : (selectedBar.diff < 0 ? '-' : '')) + selectedBar.diffPercent }}%
                                        </template>
                                        <template v-else>
                                            {{ selectedBar.diffPercent | filterNumberSign }}%
                                        </template>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
            <!-- 鼠标放图标上改变价格区分分时和K图结束 -->
            
        </div>

        <div v-show='activeTab === "timeSharing"' class='TSArea'>
            <TimeSharing ref='timeSharing' @mounted='handleTSMounted' @onSelected='handleTSSelected' />
            <StallsAndDeal
                v-if='false && activeTab === "timeSharing" && product.market_id === 8'
                :deal-str='dealStr'
                :digit='product.digit'
                :product-id='productId'
                :stalls-str='stallsStr'
                :status="{ stalls: linesData['stalls'].status, deal: linesData['deal'].status }"
            />
        </div>

        <div v-show='activeTab !== "timeSharing"' class='tv-wrap'>
            <div class='tv-main'>
                <!-- 主图指标 -->
                <div v-show='!horizontal' ref='mainStudyArea' class='study-area'>
                    <div class='main-study'>
                        <div class='content'>
                            <div
                                v-for='(item, i) in mainStudyList'
                                :key='i'
                                class='item'
                                :class='{ active: mainStudy === item.name, disabled: !TVHasInit }'
                            >
                                <span
                                    class='inner-label'
                                    @click='!H5Device && onClickStudy("main", item.name)'
                                    @touchend='H5Device && onClickStudy("main", item.name)'
                                >
                                    {{ item.label }}
                                </span>
                            </div>
                            <span class='item more' @click='openStudyDialog'>
                                <span class='inner-label'>
                                    {{ $t('chart.more') }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div ref='TVArea' class='TV-area'>
                    <div v-if='horizontal' key='block-info' class='block-info'>
                        <div class='info-l'>
                            <span class='name'>
                                {{ product.lastPrice.symbolName }}
                            </span>
                            <span class='code'>
                                {{ product.lastPrice.symbol }}
                            </span>
                            <span v-if='interval' class='interval' @click='showCycle = !showCycle'>
                                {{ interval && $t('chart.'+tvKtype[interval]) }}
                            </span>
                            <div class='study' @click='showInterval = !showInterval'>
                                <span class='iconfont icon_zhibiao'></span>
                            </div>
                        </div>
                        <div v-if='selected' class='info-r'>
                            <div class='s'>
                                <span class='label'>
                                    {{ $t('chart.open') }}
                                </span>
                                <span>
                                    {{ selectedBar.open }}
                                </span>
                            </div>
                            <div class='s'>
                                <span class='label'>
                                    {{ $t('chart.close') }}
                                </span>
                                <span>
                                    {{ selectedBar.close }}
                                </span>
                            </div>
                            <div class='s'>
                                <span class='label'>
                                    {{ $t('chart.high') }}
                                </span>
                                <span>
                                    {{ selectedBar.high }}
                                </span>
                            </div>
                            <div class='s'>
                                <span class='label'>
                                    {{ $t('chart.low') }}
                                </span>
                                <span>
                                    {{ selectedBar.low }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div id='tv_chart_container' ref='tv_chart_container'></div>
                    <div v-if="origin === 'miniTrade'" class='cover-right'></div>
                    <!-- <div
                        v-show='!horizontal && hasSetFullScreenStyle && showFullScreenBtn && !$store.state.inApp'
                        key='toggleFullScreenBtn'
                        ref='toggleFullScreenBtn'
                        class='toggleFullScreenBtn'
                        @click='toggleFullScreen(true)'
                    >
                    </div> -->
                </div>

                <!-- 兼容性问题（iframe兄弟节点无法遮住iframe，提到更外层作遮罩） -->
                <div v-show='showCycle || showInterval' ref='popupWrap' class='popup-wrap'></div>

                <div v-show='!horizontal' ref='studyArea' class='study-area van-hairline--top'>
                    <!-- <div class='split'></div> -->
                    <div class='side-study'>
                        <div class='content'>
                            <div
                                v-for='(item, i) in sideStudyList'
                                :key='i'
                                class='item'
                                :class='{ active: subStudy === item.name, disabled: !TVHasInit }'
                            >
                                <span
                                    class='inner-label'
                                    @click='!H5Device && onClickStudy("sub", item.name)'
                                    @touchend='H5Device && onClickStudy("sub", item.name)'
                                >
                                    {{ item.label }}
                                </span>
                            </div>
                            <span class='item more' @click='openStudyDialog'>
                                <span class='inner-label'>
                                    {{ $t('chart.more') }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            
            <StallsAndDeal
                v-if=' false && activeTab !== "timeSharing" && product.market_id === 8'
                :deal-str='dealStr'
                :digit='product.digit'
                :product-id='productId'
                :stalls-str='stallsStr'
                :status="{ stalls: linesData['stalls'].status, deal: linesData['deal'].status }"
            />
        </div>

        <!-- <div v-show='horizontal && !showIntervalStatus && !showCycleStatus && showFullScreenBtn && !$store.state.inApp' key='toggleHorizontalBtn' ref='toggleHorizontalBtn' class='toggleHorizontalBtn' @click='toggleFullScreen(false)'>
        </div> -->

        <StudyList :prop-main-study='mainStudy' :prop-sub-study='subStudy' :show.sync='showStudyDialog' @createStudy='createStudy' @removeStudy='removeStudy' />

        <!-- 横屏周期 -->
        <van-popup
            v-model='showCycle'
            :get-container="() => $refs['popupWrap']"
            position='right'
            :style="{ height: '100%', overflow: 'hidden' }"
            @closed='showCycleStatus = false'
            @open='showCycleStatus = true'
        >
            <div class='block-cycle'>
                <div v-for='item in candleKTypeList.slice(1)' :key='item.title' class='item' :class='[interval ===item.ktype && "active"]' @click='tabChange(item.ktype, item.title); (showCycle=false)'>
                    <span class='inner-label'>
                        {{ item.title }}
                    </span>
                    <span class='sign'>
                        <template v-if='interval ===item.ktype'>
                            <van-icon color='#1846d6' name='success' />
                        </template>
                    </span>
                </div>
            </div>
        </van-popup>

        <!-- 横屏指标 -->
        <van-popup
            v-model='showInterval'
            :get-container="() => $refs['popupWrap']"
            position='right'
            :style="{ height: '100%', overflow: 'hidden' }"
            @closed='showIntervalStatus = false'
            @open='showIntervalStatus = true'
        >
            <div class='block-interval'>
                <div class='main'>
                    <div class='title'>
                        {{ $t('productInfo.mainStudy') }}
                    </div>
                    <div class='content'>
                        <div
                            v-for='(item, i) in MAINSTUDIES'
                            :key='i'
                            class='item'
                            :class='{ active: mainStudy === item.name, disabled: !TVHasInit }'
                            @click='!H5Device && onClickStudy("main", item.name)'
                            @touchend='H5Device && onClickStudy("main", item.name)'
                        >
                            <span
                                class='inner-label'
                            >
                                {{ item.label }}
                            </span>
                            <span class='sign'>
                                <template v-if='mainStudy === item.name'>
                                    <van-icon color='#1846d6' name='success' />
                                </template>
                            </span>
                        </div>
                    </div>
                </div>
                <div class='sub'>
                    <div class='title'>
                        {{ $t('productInfo.subStudy') }}
                    </div>
                    <div class='content'>
                        <div
                            v-for='(item, i) in SUBSTUDIES'
                            :key='i'
                            class='item'
                            :class='{ active: subStudy === item.name, disabled: !TVHasInit }'
                        >
                            <span
                                class='inner-label'
                                @click='!H5Device && onClickStudy("sub", item.name)'
                                @touchend='H5Device && onClickStudy("sub", item.name)'
                            >
                                {{ item.label }}
                            </span>
                            <span class='sign'>
                                <template v-if='subStudy === item.name'>
                                    <van-icon color='#1846d6' name='success' />
                                </template>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { WidgetConfig, candleKTypeList, klineTypeList } from './widget.config'
import { UDFCompatibleDatafeed } from './datafeeds/udf/lib/udf-compatible-datafeed'
import { KtypeList, tvKtype } from './datafeeds/udf/lib/ktype'
import { localSet, localGet, localRemove } from '@/utils'
import Util from '@/utils/tradeDataUtil'
import dayjs from 'dayjs'
import { customIndicatorsGetter } from './customStudy'
import { MAINSTUDIES, SUBSTUDIES } from './constant'
import Constant from '@/utils/Constant'
import { toFixed } from '@/utils/calculation'
import zh from 'dayjs/locale/zh-cn'
import en from 'dayjs/locale/en'
import TimeSharing from '@/components/TimeSharing'
import StudyList from './components/StudyList'

import KIcon from './icons/kIcon'
import { Switch, Icon, Checkbox } from 'vant'
import TradeUtil from "@/utils/tradeUtil"

import { appSetDeviceRotate, appFunctionisExist } from '@/utils/appHybrid'


const timeZone = dayjs().utcOffset() * 60 * 1000 // 时区，单位为分钟
export default {
    components: {
        KIcon,
        [Icon.name]: Icon,
        [Switch.name]: Switch,
        [Checkbox.name]: Checkbox,
        TimeSharing,
        StudyList
    },
    filters: {
        toFixed (num, digit) {
            console.log("toFixedtoFixed",toFixed(num, digit))
            return toFixed(num, digit)
        },
        formatTime (timestamp, format) {
            return timestamp ? dayjs(timestamp).format(format) : '- -'
        },
        filterNumberSign (val = '') {
            if (!/[0-9]+/g.test(val)) {
                return '- -'
            }
            let result = val
            const num = val.replace('%', '') * 1
            if (num > 0) {
                result = result.replace(num, '+' + num)
            }
            return result
        }
    },
    props: {
        productId: {
            type: [Number, String],
            default: 0
        },
        height: {
            type: Number
        },
        isapp: {
            type: Boolean,
            default: false
        },
        positions: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            H5Device: 'ontouchend' in document.body,
            activeTab: null,
            klineData: [],
            resolution: KtypeList[0],
            awaitCount: 0,
            loading: false,
            studyLimit: 3,
            klineType: 1,
            klineTypeList: klineTypeList,
            hasMouseDown: false, // 切换周期后标记用户是否点击(防止自动触发十字光标事件)
            selected: false,
            selectedBar: {
                colorStr: {}
            },
            moreTimeIsOpened: false,
            storageKTypeKey: 'productDetailNewKTypeActive',
            moreKType: {},
            mainStudyList: MAINSTUDIES.slice(0, 5), // 主图
            sideStudyList: SUBSTUDIES.slice(0, 5), // 副图
            settingStatus: false,
            lineList: [
                {
                    title: this.$t('chart.lastValueLine'),
                    value: 'lastValue'
                },
                {
                    title: this.$t('chart.positionLine'),
                    value: 'position',
                },
                {
                    title: this.$t('chart.buyLine'),
                    value: 'buy',
                },
                {
                    title: this.$t('chart.sellLine'),
                    value: 'sell',
                },
                // {
                //     title: '买卖五档',
                //     value: 'stalls',
                // },
                // {
                //     title: '成交数据',
                //     value: 'deal',
                // }
            ],

            linesData: {
                lastValue: {
                    status: true
                },
                position: {
                    status: true
                },
                buy: {
                    status: false
                },
                sell: {
                    status: false
                },
                // stalls: {
                //     status: true
                // },
                // deal: {
                //     status: true
                // }
            },
            lineEntities: {}, // 价格线实体
            TVHasInit: false,
            studyMoveTimeEnd: 0,
            isShowTab: true,
            selectedDataForTS: {},
            showStudyDialog: false,
            mainStudy: '',
            subStudy: '',
            horizontal: false,
            interval: '',
            showInterval: false,
            showIntervalStatus: false,
            showCycle: false,
            showCycleStatus: false,
            hasSetFullScreenStyle: false,
            isFirstInit: true,
            showFullScreenBtn: false,
            moreKTypesIndex: 5, // tab值（moreKTypes）
            util: Util
        }
    },
    computed: {
        ...mapState(['quote', 'socket', 'symbolInfo', 'user', 'priceColorType']),
        MAINSTUDIES () { return MAINSTUDIES },
        SUBSTUDIES () { return SUBSTUDIES },
        ...mapGetters(['style']),
        ...mapState({
            groupGet: {},
            userConfigInfo: state => state.userConfigInfo,
            origin: state => state.origin
        }),
        tvKtype () { 
            return tvKtype 
        },
        product () {
            return {"lastPrice":this.quote.codeTickMap[this.productId],"digit":this.quote.notify[this.productId].uiDigit}
        },
        language () {
            return 'zh-CN'
        },
        // 路由携带的涨跌颜色值
        upColor () {
            return (this.isapp && this.$route && this.$route.query.up) ? this.$route.query.up : ''
        },
        downColor () {
            return (this.isapp && this.$route && this.$route.query.down) ? this.$route.query.down : ''
        },
        lang () {
            return this.language === 'en-US' ? 'en' : 'zh'
        },
        klineTypeIndex () {
            const curIndex = this.klineTypeList.findIndex(el => el.value === this.klineType)
            return curIndex + 1
        },
        // 涨跌色(路由携带的颜色参数最高，其次是$store存的颜色值)
        styleColors () {
            const zdz = this.priceColorType
            const style = {
                riseColor: '#10b873',
                fallColor: '#e3525c'
            }
            return {
                up: this.upColor || zdz == 2 ? style.riseColor : style.fallColor,
                down: this.downColor || zdz == 2 ? style.fallColor : style.riseColor
            }
        },
        isPC () {
            return window['isPC']
        },
        candleKTypeList () {
            const list = candleKTypeList(this)
            let result = []
            if ([0, 1, 2, 9].includes(this.product.market_id)) {
                result = list.filter(item => !['240'].includes(item.ktype))
            } else {
                result = list
            }
            return result
        },
        stallsStr () {
            return this.product.stallsStr
        },
        dealStr () {
            return this.product.dealStr
        },
        canShowFullScreenBtn () {
            return !this.isPC && (!this.isapp || (this.isapp && appFunctionisExist('appSetDeviceRotate')))
        },
        data() {
            return this.quote.codeTickMap[this.productId] || {}
        }
    },
    watch: {
        height (val) {
            this.$refs['tv_chart_container'].getElementsByTagName('iframe')[0].style.height = `${this.getChartHeight(val)}px`
            this.handleTSMounted()
        },
        productId (val, oldVal) {
            if (val && val !== oldVal) {
                this.init()
                this.isShowTab = false
                this.initTradingView()
                this.$refs['timeSharing'].reset()
            }
        },
        'product.lastPrice.bid' (val) {
            const entity = Array.isArray(this.lineEntities['buy']) && this.lineEntities['buy'][0] && this.lineEntities['buy'][0].entity
            entity && entity.setPrice(val)
        },
        'product.lastPrice.ask' (val) {
            const entity = Array.isArray(this.lineEntities['sell']) && this.lineEntities['sell'][0] && this.lineEntities['sell'][0].entity
            entity && entity.setPrice(val)
        },
        'product.lastPrice.low' (val) {
            this.updateTSPrice()
        },
        'product.lastPrice.high' (val) {
            this.updateTSPrice()
        },
        'product.lastPrice.preclose': {
            immediate: true,
            handler (val) {
                //console.log("valval",val)
                if (val) {
                    this.handleTSMounted()
                }
            },
        },
        userConfigInfo: {
            deep: true,
            handler (val) {
                this.init()
                this.initTradingView()
            }
        },
        activeTab (val) {
            //console.log("805",val)
            if (val === 'timeSharing') {
                this.handleTSMounted()
            }
        }
    },
    created () {
        this.init()
    },
    mounted () {
        this.initTradingView()
        this.initTSChart()
        //console.log(this.quote)
        if (this.canShowFullScreenBtn) {
            window.addEventListener('resize', this.bindResize)
            this.handleResize()
        }
    },
    beforeDestroy () {
        // console.log('%c tvvm销毁前', 'background:#8ef;');
        this.tvWidget.remove()
        window['datafeed'] = undefined
        window['tvvm'] = undefined
        window['tvWidget'] = undefined

        if (!this.isPC) {
            window.removeEventListener('resize', this.bindResize)
        }
    },
    methods: {
        // 初始化
        init () {
            this.initOtherTime()
            try {
                const data = JSON.parse(localGet('tvLines')) || {}
                Object.assign(this.linesData, data)

                const { mainStudy, subStudy } = this.getLocalStudy()
                if (mainStudy + '' !== 'null') {
                    this.mainStudy = mainStudy ? mainStudy.name : 'Moving Average mock'
                }
                if (subStudy + '' !== 'null') {
                    this.subStudy = subStudy ? subStudy.name : 'Custom MACD'
                }
            } catch (error) {
                console.log("error",error)
            }
        },
        // tab切换
        tabChange (name, title) {
            this.hasMouseDown = false
            const { tvWidget, datafeed } = this
            const activeChart = tvWidget.activeChart && tvWidget.activeChart()
            const oldCycle = tvWidget.activeChart().resolution()

            if (['timeSharing', '1'].includes(name)) {

                //console.log("timeSharing",name)

                activeChart.setResolution('1', () => {
                    //console.log('分时tv数据更新周期')
                })

                if (oldCycle === activeChart.resolution() && datafeed) {
                    this.loading = true
                    datafeed.onResetCacheNeededCallback && datafeed.onResetCacheNeededCallback()
                    activeChart.resetData()
                }
                this.setKType(name)
            } else {
                
                if (name !== 'moreKTypes') {
                    activeChart.setResolution(name, () => {
                        //console.log('K图elsetv数据更新周期')
                    })
                    this.setKType(name)
                }
            }
        },
        // 切换标签前的回调函数
        onBeforeChange (name, title) {
            if (name !== 'moreKTypes') {
                this.initOtherTime()
                return true
            }
            this.moreTimeIsOpened = !this.moreTimeIsOpened
        },
        // 更多周期
        onClickMoreTime ({ title, ktype }) {
            this.activeTab = 'moreKTypes'
            this.initOtherTime(title, ktype)
            this.moreTimeIsOpened = false
            const activeChart = this.tvWidget.activeChart()
            activeChart.setResolution(ktype)
            this.setKType(ktype)
        },

        getKType () {
            //console.log("getKTypegetKTypegetKTypegetKTypegetKType")
            const oldIndex = localGet('productDetailKTypeActive')
            const newStorage = localGet(this.storageKTypeKey)
            let result = this.candleKTypeList[0]

            if ([0, 1, 2, 9].includes(this.product.market_id)) {
                // 股票K线为日K
                const i = this.candleKTypeList.findIndex(e => e.ktype === '1D')
                i !== -1 && (result = this.candleKTypeList[i])
            } else if (oldIndex) {
                // 兼容旧缓存
                const kTypeData = this.candleKTypeList[oldIndex]
                kTypeData && (result = kTypeData)
                if (oldIndex >= 6 && !this.isPC) {
                    result.activeTab = 'moreKTypes'
                }
                localRemove('productDetailKTypeActive')
                localSet(this.storageKTypeKey, result.ktype)
            } else if (newStorage) {
                const i = this.candleKTypeList.findIndex(e => e.ktype === localGet(this.storageKTypeKey))
                i !== -1 && (result = this.candleKTypeList[i])
                if (i >= this.moreKTypesIndex && !this.isPC) {
                    result.activeTab = 'moreKTypes'
                }
            }
            return result
        },

        setKType (ktype) {
            localSet(this.storageKTypeKey, ktype)
        },

        initOtherTime (title, ktype = null) {
            if (title) {
                this.moreKType.title = title
            }
            this.moreKType.ktype = ktype
        },

        // 选择指标
        onClickStudy (type, name) {
            if (!this.TVHasInit) {
                return
            }
            const obj = {
                main: 'mainStudy',
                sub: 'subStudy'
            }
            const oldStudyName = this[obj[type]]

            if (oldStudyName === name) {
                this.removeStudy(type)
            } else {
                this.removeStudy(type)
                this.createStudy(type, name)
            }
        },
        // 增加单个指标
        createStudy (type, name) {
            const { tvWidget } = this
            const target = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES].find(item => item.name === name) || null))
            const localStudy = this.getLocalStudy()
            if (!target) {
                return
            }

            const _temp = {
                main: 'mainStudy',
                sub: 'subStudy',
            }
            const localStudyKey = _temp[type]
            const localStudyData = localStudy[localStudyKey]
            const params = target.params || [false, false]
            if (localStudyData && Array.isArray(localStudyData.params) && localStudyData.params.length) {
                params[2] = localStudyData.params
            }

            tvWidget.chart().createStudy(target.name, ...params)
                .then(studyId => {
                    switch (type) {
                        case 'main': {
                            this.mainStudy = name
                            this.setLocalStudy({
                                mainStudy: {
                                    name,
                                    params: params[2],
                                    studyId
                                }
                            })
                            break
                        }
                        case 'sub': {
                            this.subStudy = name
                            this.setLocalStudy({
                                subStudy: {
                                    name,
                                    params: params[2],
                                    studyId
                                }
                            })
                            break
                        }
                    }
                })
        },
        // 移除主/副指标
        removeStudy (type) {
            const { tvWidget } = this
            const allStudies = tvWidget.activeChart().getAllStudies()

            switch (type) {
                case 'main': {
                    const mainStudies = MAINSTUDIES.map(item => item.name)
                    allStudies.forEach(item => {
                        if (mainStudies.includes(item.name)) {
                            tvWidget.chart().removeEntity(item.id)
                        }
                    })
                    this.mainStudy = ''
                    // this.setLocalStudy({
                    //     mainStudy: null
                    // })
                    break
                }
                case 'sub': {
                    const subStudies = SUBSTUDIES.map(item => item.name)
                    allStudies.forEach(item => {
                        if (subStudies.includes(item.name)) {
                            tvWidget.chart().removeEntity(item.id)
                        }
                    })
                    this.subStudy = ''
                    // this.setLocalStudy({
                    //     subStudy: null
                    // })
                    break
                }
            }
        },
        // 监听图表指标操作事件(hide/show/move/remove/click)
        handleStudyEvent (id, event) {
            if (['remove'].includes(event)) {
                const allStudyIds = this.tvWidget.activeChart().getAllStudies().map(item => item.id)
                const oldLocalStudy = this.getLocalStudy()

                Object.keys(oldLocalStudy).forEach((key) => {
                    const obj = oldLocalStudy[key]
                    if (obj && obj.studyId && !allStudyIds.includes(obj.studyId)) {
                        if (key === 'mainStudy') {
                            this.mainStudy = ''
                            this.setLocalStudy({
                                mainStudy: null
                            })
                        }
                        if (key === 'subStudy') {
                            this.subStudy = ''
                            this.setLocalStudy({
                                subStudy: null
                            })
                        }
                    }
                })
            }
        },
        // 监听指标属性更改事件
        handleStudyPropertiesChanged (id) {
            const oldLocalStudy = this.getLocalStudy()
            const data = this.getStudyentity(id)

            Object.keys(oldLocalStudy).forEach(key => {
                const obj = oldLocalStudy[key]
                if (obj && obj.studyId === id) {
                    this.setLocalStudy({
                        [key]: {
                            ...obj,
                            params: data.values.map(item => item.value)
                        }
                    })
                }
            })
        },
        // 统一设置指标缓存(包括属性)
        setLocalStudy (args) {
            const oldLocalStudy = this.getLocalStudy()
            if (args) {
                localSet('user_studies', {
                    ...oldLocalStudy,
                    ...args
                })
            } else {
                localSet('user_studies', {})
            }
        },
        // 统一获取指标缓存(包括属性)
        getLocalStudy () {
            let result = {}
            try {
                const localData = JSON.parse(localGet('user_studies'))
                if (Object.prototype.toString.call(localData) === '[object Object]') {
                    const temp = {}
                    Object.keys(localData).forEach(key => {
                        temp[key] = localData[key]
                    })
                    result = temp
                }
            } catch (error) {
                console.log("error",error)
            }
            return result
        },

        // 获取单个现存指标实例的数据
        getStudyentity (id) {
            let result = null
            try {
                const entity = this.tvWidget.activeChart().getStudyById(id)
                const info = entity._study.metaInfo()
                const values = entity.getInputValues()
                result = {
                    description: info.description,
                    values
                }
            } catch (error) {
                console.log("error1096",error)
            }
            return result
        },
        getChartHeight (num = this.height) {
            return Math.max(num, 200) - this.$refs['tabsWrap'].offsetHeight - this.$refs['studyArea'].offsetHeight - this.$refs['mainStudyArea'].offsetHeight
        },
        getRem() {
            var width = document.documentElement.clientWidth;
            if (width <= 750){
                return 50 * (width / 375)
            }else{
                return 100
            }
        },
        // 初始化 TradingView
        initTradingView (resolveConfig) {
            // this.linesData.positionLineVisible = localGet('positionLineVisible') !== 'false';
            const { candleKTypeList } = this
            const kTypeData = this.getKType()
            this.activeTab = kTypeData.activeTab || kTypeData.ktype
            const kType = this.activeTab === 'timeSharing' ? '1' : kTypeData.ktype

            kTypeData.activeTab && this.initOtherTime(kTypeData.title, kType)

            this.$nextTick(() => {
                this.isShowTab = true
            })

            const datafeed = this.datafeed = new UDFCompatibleDatafeed('', { store: this.$store, vm: this })
            window['datafeed'] = datafeed
            window['tvvm'] = this
            const style = {
                riseColor: this.styleColors.up,
                fallColor: this.styleColors.down,
            }

            // 横屏增加画线工具
            if (!resolveConfig && this.isPC) {
                resolveConfig = option => {
                    option.disabled_features = option.disabled_features.filter(e => !['left_toolbar', 'vert_touch_drag_scroll'].includes(e))
                    return options
                }
            }

            const config = WidgetConfig(style, resolveConfig)
            // if (this.upColor) {
            //     Object.assign(config.overrides, {
            //         ...config.overrides,
            //         'mainSeriesProperties.candleStyle.upColor': this.upColor,
            //         'mainSeriesProperties.candleStyle.borderUpColor': this.upColor,
            //         'mainSeriesProperties.candleStyle.wickUpColor': this.upColor,
            //     })
            // }
            // if (this.downColor) {
            //     Object.assign(config.overrides, {
            //         ...config.overrides,
            //         'mainSeriesProperties.candleStyle.downColor': this.downColor,
            //         'mainSeriesProperties.candleStyle.borderDownColor': this.downColor,
            //         'mainSeriesProperties.candleStyle.wickDownColor': this.downColor
            //     })
            // }

            //let chartH = this.height - this.$refs['tabsWrap'].offsetHeight - this.$refs['placeholder'].offsetHeight - this.$refs.studyArea.offsetHeight - this.$refs['mainStudyArea'].offsetHeight
            let chartH = this.height - this.$refs['tabsWrap'].offsetHeight
            //console.log('chartH_thisheight', chartH,this.height)

            //!this.isapp && chartH < this.height && (chartH = this.height)

            const digit = this.product.digit
            const options = {
                // debug: true, // uncomment this line to see Library errors and warnings in the console
                ...config,
                width: document.documentElement.clientWidth,
                height: chartH,
                locale: this.language === 'en-US' ? 'en' : 'zh',
                symbol: this.productId,
                interval: kType,
                container_id: 'tv_chart_container',

                //	BEWARE: no trailing slash is expected in feed URL
                datafeed: datafeed,
                custom_indicators_getter: function (PineJS) {
                    return customIndicatorsGetter(PineJS, digit)
                }
            }

            if (!this.isFirstInit) {
                this.tvWidget.save((data) => (options.saved_data = data))
            }

            if (this.isPC) {
                delete options.height
                options.autosize = true
            }

            this.tvWidget = window.tvWidget = new TradingView.widget(options)
            this.showFullScreenBtn = false
            return new Promise((resolve, reject) => {
                this.tvWidget.onChartReady(() => {
                    resolve()
                    this.showFullScreenBtn = true
                    // if (this.activeTab === 'timeSharing') {
                    //     // 分时
                    //     this.tvWidget.activeChart().setChartType(3)
                    // }

                    this.TVHasInit = true

                    if (this.isFirstInit) {
                        this.isFirstInit = false
                        this.mainStudy && this.createStudy('main', this.mainStudy)
                        this.subStudy && this.createStudy('sub', this.subStudy)
                    }

                    this.$watch('product.lastPrice.newP', function (newval) {
                        //console.log("开始watch",this.activeTab)
                        if (this.activeTab === 'timeSharing') {
                            this.$refs.timeSharing.onTick({
                                time: this.product.lastPrice.dtime * 1000,
                                close: newval
                            })
                        } else {
                            this.watchPrice(newval)
                        }
                    })

                    this.tvWidget.subscribe('study_event', (id, event) => {
                        this.handleStudyEvent(id, event)
                    })

                    this.tvWidget.subscribe('study_properties_changed', (entityId) => {
                        this.handleStudyPropertiesChanged(entityId)
                    })
                    // K线数据加载完之后显示持仓线
                    const activeChart = this.tvWidget.activeChart()
                    let hasInitLines = false
                    activeChart.onDataLoaded().subscribe(null, e => {
                        this.onDataLoaded = true
                        // console.log('%c开始画持仓线', 'background:#e8f;')
                        // this.setPositionLine();

                        // 绘画价格线
                        if (!hasInitLines) {
                            hasInitLines = true
                            Object.keys(this.linesData).forEach(key => {
                                this.linesData[key].status && this.setLine(key)
                            })
                        }

                        this.$watch('positions', function (newval, oldval) {
                            this.watchPosition(newval, oldval)
                        })
                    })

                    // 十字光标位置
                    this.setCrossHairMoved()

                    // 监听鼠标/触控
                    this.setListener()

                    // 全屏按钮样式
                    // this.setFullScreenStyle()
                    if (this.canShowFullScreenBtn) {
                        this.appendBtnToIframe()
                    }

                    this.interval = activeChart.resolution()
                    activeChart.onIntervalChanged()
                        .subscribe(null, (interval, timeframeObj) => {
                            this.interval = interval
                        })

                    if (this.isPC) {
                        this.$refs['tv_chart_container'].addEventListener('mouseleave', () => {
                            this.selected = false
                        })
                    }

                    this.tvWidget.subscribe('onTick', (data) => {
                        //console.log("1320",data)
                        if (this.selected && this.selectedBar.time === data.time) {
                            this.handleCrossHairMoved(data.time)
                        }
                    })
                })
            })
        },
        // 监听行情报价
        watchPrice (newval) {
            //console.log("watchPrice1291",newval)
            newval = newval * 1
            const product = this.product
            if (!this.tvWidget.chart) return false
            try {
                const _series = this.tvWidget.chart().getSeries()._series
                const last = _series.bars().last().value
                const lastTime = last[0] * 1000
                const curTime = product.lastPrice.dtime * 1000
                let isSameCandleChart = false
                const resolution = this.tvWidget.activeChart().resolution()

                const formatTimes = {
                    '1D': 'YYYY-MM-DD',
                    '1M': 'YYYY-MM',
                }

                if (formatTimes[resolution] && dayjs(lastTime).format(formatTimes[resolution]) === dayjs(curTime).format(formatTimes[resolution])) {
                    isSameCandleChart = true
                } else if (resolution === '1W' && dayjs(curTime).diff(lastTime, 'week') === 0) {
                    isSameCandleChart = true
                } else if (curTime <= lastTime) {
                    isSameCandleChart = true
                }
                // 如果报价属于最后一根K线的时间则继续绘制最后一根K线，否则加载下一根K线
                if (isSameCandleChart) {
                    //console.log("1355",last,lastTime)
                    this.datafeed.onTick({
                        time: lastTime,
                        open: last[1],
                        high: Math.max(last[2], newval),
                        low: Math.min(last[3], newval),
                        close: newval,
                        volume: 0
                    })
                } else {
                    const chart = this.tvWidget.chart()
                    const resolution = chart.resolution()
                    const ktype = tvKtype[resolution]
                    //console.log("tv-1356行",{ resolution, ktype, tvKtype })
                    if (!ktype) throw Error(resolution + ' K线类型未定义')
                    this.loadingNextKline(ktype)
                }
            } catch (error) {
                //console.log("error1322",error)
            }
        },
        /* 计算下一根K线的时间
         * resolution 周期类型
         * time 报价时间， 单位秒
         * 返回时间单位毫秒
        */
        nextKlineTime (resolution, time) {
            let nextTime
            if (parseInt(resolution) <= 60) {
                nextTime = time - time % (60 * resolution) + 60 * resolution
            }
            return nextTime * 1000
        },
        // 加载最近两根K线，结束正在画的一条，以及绘制新的K线数据
        loadingNextKline (resolution) {
            const newParams = {
                "5min" : { "param" : { time: 0, num: 2, period_num: 5, period_type: 1, flag: 0 }, "index" : 1 },
                "15min" : { "param" : { time: 0, num: 2, period_num: 5, period_type: 1, flag: 0 }, "index" : 2 },
                "30min" : { "param" : { time: 0, num: 2, period_num: 5, period_type: 1, flag: 0 }, "index" : 3 },
                "1hour": { "param" : { time: 0, num: 2, period_num: 1, period_type: 2, flag: 0 }, "index" : 4 },
                "day": { "param" : { time: 0, num: 2, period_num: 0, period_type: 3, flag: 0 }, "index" : 5 },
                "1min" : { "param" : { time: 0, num: 2, period_num: 1, period_type: 1, flag: 0 }, "index" : 6 },
                "2hour": { "param" : { time: 0, num: 2, period_num: 1, period_type: 2, flag: 0 }, "index" : 99 },
                "4hour": { "param" : { time: 0, num: 2, period_num: 1, period_type: 2, flag: 0 }, "index" : 9 },
                "week": { "param" : { time: 0, num: 2, period_num: 1, period_type: 4, flag: 0 }, "index" : 7 },
                "month": { "param" : { time: 0, num: 2, period_num: 0, period_type: 5, flag: 0 }, "index" : 8 },
            }

            const msgTimeStr = String(new Date().getTime()).slice(5)
            this.socket.quoteSocket.emit('request',
                Number(Constant.Req.quoteQuery),
                Object.assign(newParams[resolution].param, {
                    code: Number(this.productId),
                    seq: msgTimeStr
                })
            )

            this.socket.quoteSocket.on('quote_query', (param, data) => {
                const seq = param.seq
                if (msgTimeStr == seq){
                    let list = []
                    let history = []
                    for (const i in data) {
                        history.push(data[i])
                    }
                    history.reverse()
                    if(resolution=="15min"){
                        history = TradeUtil.transKcharts2(1, history)
                    }else if(resolution=="30min"){
                        history = TradeUtil.transKcharts(2, history)
                    }else if(resolution=="1hour"){
                        history = TradeUtil.kLineDataGroup(history,2)
                    }else if(resolution=="2hour"){
                        history = TradeUtil.kLineDataGroup(history,1)
                    }

                    
                    for (const i in history) {
                        const arrData = {}
                        arrData["time"] = history[i].tm
                        arrData["begin"] = history[i].begin
                        arrData["highest"] = history[i].highest
                        arrData["lowest"] = history[i].lowest
                        arrData["end"] = history[i].end
                        arrData["volume"] = 0
                        list.push(arrData)
                    }
                    list.sort((a, b) => a.time - b.time)
                    list.forEach(el => {
                        this.datafeed.onTick({
                            time: el.time*1000,
                            open: el.begin,
                            high: el.highest,
                            low: el.lowest,
                            close: el.end,
                            volume: 0
                        })
                    })
                }
            })
        },
        // 设置K线类型样式
        setKlineType (item) {
            this.klineType = item.value
            this.tvWidget.activeChart().setChartType(item.value)
            setTimeout(() => {
                this.$refs.klineType.toggle()
            }, 50)
        },
        // 十字光标监听事件
        handleCrossHairMoved (time) {
            const { digit } = this.product
            const _series = this.tvWidget.chart().getSeries()._series
            const bars = _series.bars()
            let prevBar = null
            const currentBar = bars.findFirst((i, item) => {
                if (item[0] === time) {
                    prevBar = bars.state().data[i - 1]
                    return true
                }
            })

            return new Promise((resolve, reject) => {
                if (currentBar) {
                    const ktype = this.getKType().ktype
                    let timeStr = dayjs(time * 1000).format('HH:mm:ss')
                    if (['1D', '1M', '1W'].includes(ktype)) {
                        const locale = this.lang === 'en' ? en : zh
                        timeStr = dayjs(time * 1000).locale(locale).format('dddd')
                    } else {
                        const timeStr = dayjs(time * 1000).format('HH:mm:ss')
                    }

                    // 当前K线
                    const { value } = currentBar
                    this.selectedBar = {
                        open: toFixed(value[1], digit),
                        low: toFixed(value[3], digit),
                        high: toFixed(value[2], digit),
                        close: toFixed(value[4], digit),
                        diff: 'n/a',
                        diffPercent: 'n/a',
                        dateStr: dayjs(time * 1000).format('YYYY/MM/DD'),
                        timeStr: timeStr,
                        time,
                        colorStr: {}
                    }

                    if (prevBar) {
                        // 上一条k线
                        const { value: prevValue } = prevBar
                        const prevClose = prevValue[4]
                        const { selectedBar, getColorStr } = this

                        const diff = toFixed(selectedBar.close - prevClose, digit)
                        const diffPercent = toFixed((selectedBar.close - prevClose) / prevClose * 100, 2)

                        Object.assign(selectedBar, {
                            diff,
                            diffPercent,
                            colorStr: {
                                open: getColorStr(selectedBar.open, prevClose),
                                low: getColorStr(selectedBar.low, prevClose),
                                high: getColorStr(selectedBar.high, prevClose),
                                close: getColorStr(selectedBar.close, prevClose),
                                diff: getColorStr(diff, 0),
                                diffPercent: getColorStr(diff, 0)
                            }
                        })
                    }
                    resolve()
                } else {
                    this.selectedBar = {
                        colorStr: {}
                    }
                    reject()
                }
            })
        },

        getColorStr (a, b) {
            a *= 1
            b *= 1
            return a === b ? '' : (a > b ? this.styleColors.up : this.styleColors.down)
        },
        // 图标里面设置持仓线
        setPositionLine () {
            // if (!this.linesData.positionLineVisible) return false;
            const chart = this.tvWidget.chart()
            // if (!chart || this.positions.length === 0 || this.positionLine) return false;
            // this.positionLine = true;
            const volumeUnit = this.$t('trade.volumeUnit')
            const buy = this.$t('trade.buy')
            const sell = this.$t('trade.sell')
            //let currency = this.groupGet.currency
            currency = currency === 'IXD' ? 'USD' : currency

            const lines = []
            this.positions.forEach(el => {
                let text = el.direction === 1 ? buy : sell
                text += ` ${el.volume}` + volumeUnit
                const profitOrLoss = el.profitOrLoss + el.swap
                const n = profitOrLoss >= 0 ? '+' : ''
                const color = profitOrLoss < 0 ? this.styleColors.down : this.styleColors.up
                const entity = chart.createPositionLine()
                    .setPrice(el.open_price)
                    .setText(text)
                    .setExtendLeft(false)
                    .setLineStyle(0)
                    .setQuantity(n + profitOrLoss.toFixed(2) + ' ' + currency)
                    .setQuantityBackgroundColor(color)
                    .setBodyBorderColor(color)
                    .setLineColor(color)
                    .setQuantityBorderColor(color)
                    .setLineLength(55)
                // this['positionLine_' + el.id] = entity;
                lines.push({
                    id: el.id,
                    entity
                })
            })

            return lines
        },

        toogleLine (key, isShow) {
            if (isShow) {
                this.setLine(key)
            } else {
                this.revmoeLine(key)
            }
            localSet('tvLines', this.linesData)
        },

        // 设置价格线
        setLine (key) {
            const chart = this.tvWidget.chart()
            const entities = []
            switch (key) {
                case 'position': {
                    if (this.positions.length === 0) {
                        return
                    }
                    entities.push(...this.setPositionLine())
                    break
                }
                case 'buy': {
                    entities.push({
                        id: '',
                        entity: chart.createOrderLine()
                            .setPrice(this.product.lastPrice.bid)
                            .setText('')
                            .setLineStyle(0)
                            .setLineColor(this.styleColors.up)
                            .setQuantity(false)
                    })
                    break
                }
                case 'sell': {
                    entities.push({
                        id: '',
                        entity: chart.createOrderLine()
                            .setPrice(this.product.lastPrice.ask)
                            .setText('')
                            .setLineStyle(0)
                            .setLineColor(this.styleColors.down)
                            .setQuantity(false)
                    })
                    break
                }
                case 'lastValue': {
                    // 现价线
                    this.tvWidget.applyOverrides({
                        'mainSeriesProperties.showPriceLine': true,
                        'scalesProperties.showSeriesLastValue': true,
                    })
                }
            }

            Object.assign(this.lineEntities, {
                [key]: entities
            })
        },

        // 删除价格线
        revmoeLine (key) {
            switch (key) {
                case 'lastValue': {
                    this.tvWidget.applyOverrides({
                        'mainSeriesProperties.showPriceLine': false,
                        'scalesProperties.showSeriesLastValue': false,
                    })
                    break
                }
                default: {
                    if (!(Array.isArray(this.lineEntities[key]) && this.lineEntities[key].length > 0)) {
                        return
                    }
                    this.lineEntities[key].forEach(item => {
                        item.entity.remove()
                    })
                    this.lineEntities[key] = []
                }
            }
        },

        // 获取主窗格
        getMainPanes () {
            const activeChart = this.tvWidget.activeChart()
            return activeChart.getPanes().find(el => el.hasMainSeries())
        },
        // 获取时间刻度范围
        getVisiblePriceRange () {
            const mainPanes = this.getMainPanes()
            return mainPanes && mainPanes.getMainSourcePriceScale().getVisiblePriceRange()
        },
        // 监听持仓，更新图表持仓线的盈亏
        watchPosition (newval, oldval) {
            // console.log(JSON.parse(JSON.stringify(newval)), JSON.parse(JSON.stringify(oldval)));
            //let currency = this.groupGet.currency
            currency = currency === 'IXD' ? 'USD' : currency

            if (!this.linesData['position'].status) {
                return
            }

            if (Array.isArray(this.lineEntities['position']) && newval.length === oldval.length) {
                newval.forEach((el, i) => {
                    // const line = this.lineEntities['positionLine_' + el.id];
                    const line = this.lineEntities['position'].find(item => item.id === el.id)
                    if (!line) return false
                    const profitOrLoss = el.profitOrLoss + el.swap
                    const color = profitOrLoss < 0 ? this.styleColors.down : this.styleColors.up
                    const n = profitOrLoss >= 0 ? '+' : ''
                    line.entity.setQuantity(n + profitOrLoss.toFixed(2) + ' ' + currency)
                        .setQuantityBackgroundColor(color)
                        .setBodyBorderColor(color)
                        .setLineColor(color)
                        .setQuantityBorderColor(color)
                })
            } else {
                // this.removePositionLine(oldval);
                this.revmoeLine('position')
                newval.length && this.setLine('position')
                // newval.length && this.setPositionLine();
            }
        },
        // 删除持仓线
        // removePositionLine(positions) {
        //     positions.forEach(el => {
        //         const line = this['positionLine_' + el.id];
        //         if (line) {
        //             line.remove();
        //             delete this['positionLine_' + el.id];
        //         }
        //     })
        //     this.positionLine = false;
        // },

        // 切换周期重置x/y轴缩放比例
        resetZoom (list) {
            // 注：因activeChart().getSeries()._series.bars()的数据不可控，需使用getBars()内接口返回的数据
            if (!Array.isArray(list) || !list.length) {
                return
            }
            const maxLen = this.isPC ? 200 : 35
            const from = Math.floor(list[list.length > maxLen ? list.length - maxLen : 0].timeStr)
            const to = Math.floor(list[list.length - 1].timeStr)
            this.tvWidget.activeChart().setVisibleRange({ from, to }, { percentRightMargin: 10 })
            this.tvWidget.activeChart()._chartWidget.model().model().setPriceAutoScaleForAllMainSources(true)
        },

        openStudyDialog () {
            this.showStudyDialog = true
            // this.tvWidget.activeChart().executeActionById('insertIndicator')
        },
        // 初始化分时图
        initTSChart () {
            if (this.$refs['timeSharing']) {
                if (!this.isPC) {
                    let chartH = this.height - this.$refs['tabsWrap'].offsetHeight
                    
                    //!this.isapp && chartH < this.height && (chartH = this.height)

                    //this.$refs['timeSharing'].$el.style.height = Math.floor(chartH) + 'px'
                    //console.log("高度转换", (0.45 * this.getRem()) + "px" )
                    //console.log("初始化分时高度计算",chartH,this.height,this.$refs['mainStudyArea'].offsetHeight)

                    this.$refs['timeSharing'].$el.style.height = (Math.floor(chartH) + (2 * Math.floor(this.$refs['mainStudyArea'].offsetHeight))) + 'px'
                }
                this.$refs['timeSharing'].applyConfig({
                    colors: {
                        up: this.styleColors.up,
                        down: this.styleColors.down
                    },
                    digit: this.product.digit
                })
            }
        },

        resized () {
            this.$refs['timeSharing'].updateChart()
        },

        // 更新数据
        updateTSData (data) {
            this.$refs['timeSharing'] && this.$refs['timeSharing'].updateTSData(data)
        },

        handleTSSelected (data) {
            if (!data) {
                this.selectedDataForTS = {}
                this.selected = false
                return
            }
            const { lastPrice: { preclose }, digit } = this.product

            console.log("1732",preclose,digit,toFixed(data.close - preclose, digit))

            
            this.selectedDataForTS = {
                ...data,
                diff: toFixed(data.close - preclose, digit),
                diffPercent: toFixed((data.close - preclose) / preclose * 100, 2)
            }
            this.selected = !!data
        },

        // 分时渲染完成回调函数
        handleTSMounted () {
            if (!this.isPC && this.$refs['tabsWrap'] && this.$refs['timeSharing']) {

                let chartH = this.height - this.$refs['tabsWrap'].offsetHeight
                //console.log("渲染完成分时高度计算",chartH,this.height,this.$refs['tabsWrap'].offsetHeight,this.$refs['placeholder'].offsetHeight,this.$refs['mainStudyArea'].offsetHeight)

                //!this.isapp && chartH < this.height && (chartH = this.height)
                this.$refs['timeSharing'].$el.style.height = (Math.floor(chartH) + (2 * Math.floor(this.$refs['mainStudyArea'].offsetHeight))) + 'px'
                //this.$refs['timeSharing'].$el.style.height = Math.floor(chartH) + 'px'
            }
            this.updateTSPrice()
        },

        // 实时更新分时价格
        updateTSPrice () {
            const lastPrice = this.product.lastPrice
            if (this.$refs['timeSharing'] && lastPrice) {
                this.$refs['timeSharing'].applyConfig({
                    openPrice: Number(lastPrice.open),
                    closePrice: Number(lastPrice.preclose),
                    colors: {
                        up: this.styleColors.up,
                        down: this.styleColors.down
                    },
                    digit: this.product.digit
                })
            }
        },

        toggleFullScreen (bool, type) {
            this.isapp && type === 'click' && appSetDeviceRotate()
            if (!bool) {
                this.initTradingView(option => {
                    option.disabled_features.push('left_toolbar', 'vert_touch_drag_scroll')
                    return option
                })
                this.$emit('update:isfullScreen', bool)
                this.horizontal = bool
                this.setPortrait()
            } else {
                // 即将进入横屏
                this.initTradingView(option => {
                    option.disabled_features = option.disabled_features.filter(e => !['left_toolbar', 'vert_touch_drag_scroll'].includes(e))
                    return option
                })
                this.$emit('update:isfullScreen', bool)
                this.horizontal = bool
                this.setHorizontal()
            }
        },

        setPortrait () {
            const TVArea = this.$refs.TVArea
            const popupWrap = this.$refs.popupWrap

            TVArea.style.width = null
            TVArea.style.height = null
            TVArea.style.top = null
            TVArea.style.left = null

            popupWrap.style.width = null
            popupWrap.style.height = null
            popupWrap.style.top = null
            popupWrap.style.left = null
        },

        setHorizontal () {
            const TVArea = this.$refs.TVArea
            let width = window.innerWidth
            //console.log("widthwidth",width)
            let height = window.innerHeight

            if (window.orientation === 90 || window.orientation === -90) {
                [width, height] = [height, width]
            }

            const popupWrap = this.$refs.popupWrap
            const temp = {
                width: height + 'px',
                height: width + 'px',
                top: (height - width) / 2 + 'px',
                left: -(height - width) / 2 + 'px'
            }

            document.body.scrollTop = 0

            TVArea.style.width = temp.width
            TVArea.style.height = temp.height
            TVArea.style.top = temp.top
            TVArea.style.left = temp.left

            popupWrap.style.width = temp.width
            popupWrap.style.height = temp.height
            popupWrap.style.top = temp.top
            popupWrap.style.left = temp.left
        },
        setCrossHairMoved () {
            window.setCrossHairMoved = this.setCrossHairMoved.bind(this)
            this.tvWidget.activeChart().crossHairMoved(({ time, price }) => {
                this.isPC && (this.hasMouseDown = true)

                if (!this.hasMouseDown) {
                    return
                }
                this.handleCrossHairMoved(time)
                    .then(() => {
                        this.selected = true
                        this.tvWidget.applyOverrides({
                            'paneProperties.legendProperties.showStudyValues': true
                        })
                    })
                    .catch(() => {
                        this.selected = false
                        this.tvWidget.applyOverrides({
                            'paneProperties.legendProperties.showStudyValues': false
                        })
                    })
            })
        },
        setListener () {
            // 鼠标进入/离开(监听事件)
            this.tvWidget.subscribe('mouse_down', (event) => {
                this.hasMouseDown = true
            })
            this.tvWidget.subscribe('mouse_up', (event) => {
                this.selected = false
                this.tvWidget.applyOverrides({
                    'paneProperties.legendProperties.showStudyValues': false
                })
            })
        },
        handleResize () {
            if (this.activeTab === 'timeSharing') {
                return
            }
            if (this.horizontal && window.orientation === 0) {
                this.toggleFullScreen(false)
            } else if (window.orientation === 90 || window.orientation === -90) {
                this.toggleFullScreen(true)
            }
        },
        appendBtnToIframe () {
            //console.log('%cappendBtnToIframe', 'color:red')
            var iframe = document.querySelector('#tv_chart_container iframe')
            const div = document.createElement('div')
            div.classList.add('fullScreenBtn')
            const len = this.product.sell_price ? this.product.sell_price.length : 10
            const fillColor = '#ccc'
            if (this.horizontal) {
                div.innerHTML = `<svg t="1621511438709" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10429"><path d="M625.777778 568.888889h341.333333c34.133333 0 56.888889 22.755556 56.888889 56.888889s-22.755556 56.888889-56.888889 56.888889h-199.111111l238.933333 238.933333c22.755556 22.755556 22.755556 62.577778 0 85.333333-22.755556 22.755556-62.577778 22.755556-85.333333 0L682.666667 768V967.111111c0 34.133333-22.755556 56.888889-56.888889 56.888889s-56.888889-22.755556-56.888889-56.888889v-341.333333c0-34.133333 22.755556-56.888889 56.888889-56.888889zM56.888889 341.333333h199.111111L17.066667 108.088889C-5.688889 85.333333-5.688889 45.511111 17.066667 22.755556S79.644444 0 102.4 22.755556L341.333333 256V56.888889c0-34.133333 22.755556-56.888889 56.888889-56.888889s56.888889 22.755556 56.888889 56.888889v341.333333c0 34.133333-22.755556 56.888889-56.888889 56.888889H56.888889c-28.444444 0-56.888889-22.755556-56.888889-56.888889s28.444444-56.888889 56.888889-56.888889z" fill="${fillColor}" p-id="10430"></path></svg>`
            } else {
                div.innerHTML = `<svg t="1621511137390" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9915" data-spm-anchor-id="a313x.7781069.0.i9"><path d="M967.111111 1024h-342.869333a56.888889 56.888889 0 0 1-56.888889-56.888889v-0.455111a56.888889 56.888889 0 0 1 56.888889-56.888889h197.916444l-236.088889-236.088889a61.952 61.952 0 0 1 87.608889-87.608889l236.088889 236.088889v-197.916444a56.888889 56.888889 0 0 1 56.888889-56.888889H967.111111a56.888889 56.888889 0 0 1 56.888889 56.888889V967.111111a56.888889 56.888889 0 0 1-56.888889 56.888889zM398.222222 113.777778H201.045333l235.178667 235.178666a61.724444 61.724444 0 1 1-87.267556 87.267556L113.777778 201.045333V398.222222a56.888889 56.888889 0 0 1-113.777778 0V56.888889a56.888889 56.888889 0 0 1 56.888889-56.888889h341.333333a56.888889 56.888889 0 0 1 0 113.777778z" fill="${fillColor}" p-id="9916"></path></svg>`
            }
            div.addEventListener('click', () => {
                if (this.horizontal) {
                    this.toggleFullScreen(false, 'click')
                } else {
                    this.toggleFullScreen(true, 'click')
                }
            })

            div.style.right = 11 * len + 'px'
            iframe.contentWindow.document.body.appendChild(div)
        },
        isOks: function(obj) {
            var val
            if (obj > 0) {
                val = 'rise'
            } else if (obj === 0) {
                val = 'level'
            } else {
                val = 'fall'
            }
            return val
        },
        isHigh: function(obj) {
            var val
            if (obj.preData) {
                if (Number(obj.high) > Number(obj.preData.high)) {
                val = 'rise'
                } else if (Number(obj.high) < Number(obj.preData.high)) {
                val = 'fall'
                } else {
                val = 'level'
                }
            } else {
                val = 'level'
            }
            return val
        },
        isPreclose: function(obj) {
            var val
            if (obj.preData) {
                if (Number(obj.preclose) > Number(obj.preData.preclose)) {
                val = 'rise'
                } else if (Number(obj.preclose) < Number(obj.preData.preclose)) {
                val = 'fall'
                } else {
                val = 'level'
                }
            } else {
                val = 'level'
            }
            return val
        },
        isLow: function(obj) {
            var val
            if (obj.preData) {
                if (Number(obj.low) > Number(obj.preData.low)) {
                val = 'rise'
                } else if (Number(obj.low) < Number(obj.preData.low)) {
                val = 'fall'
                } else {
                val = 'level'
                }
            } else {
                val = 'level'
            }
            return val
        },
        isOpen: function(obj) {
            var val
            if (obj.preData) {
                if (Number(obj.open) > Number(obj.preData.open)) {
                val = 'rise'
                } else if (Number(obj.open) < Number(obj.preData.open)) {
                val = 'fall'
                } else {
                val = 'level'
                }
            } else {
                val = 'level'
            }
            return val
        },
        isNewP: function(obj) {
            var val
            if (obj.preData) {
                if (Number(obj.newP) > Number(obj.preData.newP)) {
                val = 'rise'
                } else if (Number(obj.newP) <= Number(obj.preData.newP)) {
                val = 'fall'
                }
            } else {
                if (Number(obj.newP) > Number(obj.preclose)) {
                val = 'rise'
                } else if (Number(obj.newP) <= Number(obj.preclose)) {
                val = 'fall'
                }
            }
            return val
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/mixin.scss";
.placeholder {
    height: .07rem;
}
.tv-head{
    // 若高度调整，需同时处理vant-tab组件内的高度和行高等
    width: 7.2rem;
    box-sizing: border-box;
    height: .54rem;
    position: relative; padding: 0;
    border: 1px solid #CECECE;
    border-radius: .57rem;
    margin: 0 auto .2rem auto;
}
.tabs-wrap {
    display: flex;
    height: 100%;
    .tabs {
        flex: 1;
        ::v-deep {
            .van-tab {
                padding: 0;
                .van-tab__text {
                    font-size: .22rem;
                    line-height: .52rem;
                }
            }
            .van-tab--active{
                .van-tab__text {
                    color: #FE6A1A;
                }                
            }
            .van-tabs__wrap {
                height: 100%;
                .van-tabs__nav{
                    background: none;
                }
                .van-tabs__line{
                    display: none;
                }
                .van-tabs__nav--complete{
                    padding: 0;
                }
            }
            .van-tabs__wrap--scrollable{
                .van-tab{
                    flex: 1;
                }
            }
        }
        
    }
    
    .other-time-tab {
        min-width: .9rem;
        text-align: center;
        white-space: nowrap;
    }

    .other-time-tab{
        position: relative;
        &:after {
            position: absolute;
            top: 50%;
            right: 0;
            margin-top: -.1rem;
            border: .06rem solid;
            border-color: transparent transparent #dcdee0 #dcdee0;
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            content: "";
        }
        &.opened {
            &:after {
                margin-top: -.01rem;
                transform: rotate(135deg);
                border-color: transparent transparent currentColor currentColor;
            }
        }
    }

    .more-time {
        line-height: rem(60px);
        font-size: rem(24px);
        color: #646566;
        position: absolute;
        top: .53rem;
        left: 4.9rem;
        .options {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #fff;
            z-index: 10;
            box-shadow: 0 0 0.1rem 0 #ebedf0;
            border-radius: .1rem;
            overflow: hidden;
            .option {
                font-size: .22rem;
                white-space: nowrap;
                line-height: rem(30px);
                padding: 0 .2rem;
                &.active {
                    color: $primary;
                }
            }
        }
        .mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9;
            opacity: 0;
        }
    }
    .loadingIcon {
        background: #fff;
        width: rem(80px);
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .flex-right{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        margin-left: .2rem;
    }
    .study-wrap,
    .kIcon-wrap {
        height: auto;
        ::v-deep {
            .van-dropdown-menu__title {
                font-size: .24rem;
                color: #646566;
            }
            .van-dropdown-menu__bar {
                width: 100%;
                height: 100%;
                box-shadow: none;
            }
        }
    }
    .chartPositinLine {
        font-size: rem(40px);
    }
    .study-wrap {
        width: rem(120px);
        ::v-deep {
            .van-dropdown-menu__bar {
                width: 100%;
                height: 100%;
                padding-right: 13px;
                box-sizing: border-box;
            }
        }
    }

    .kIcon-wrap {
        width: .6rem;
        padding-right: 0;
        ::v-deep {
            .van-dropdown-menu__title::after {
                display: none;
            }
        }
    }
    .kIcon {
        display: inline-block;
        vertical-align: middle;
    }
    .klineTypeRightIcon {
        font-size: .26rem;
    }
}

.selected-data {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .18rem;
    color: #a7a7a7;
    box-sizing: border-box;
    .time {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 .3rem 0 .4rem;
        white-space: nowrap;
    }
    .content {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        padding: 0;
        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-wrap: nowrap;
            white-space: nowrap;
            width: 33%;
            margin: 0 0 0 0;
            .item-value {
                color: #646566;
                padding-left: rem(5px);
            }
        }
    }
}

.tv-wrap{
    width: 7.2rem; margin: 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .tv-main{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow: hidden;
    }

    .TV-area{
        position: relative;
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        position: relative;
        .cover-right{
            position: absolute;
            right: 0;
            top: 0;
            width: rem(140px);
            height: 100%;
            box-sizing: border-box;
            z-index: 1;
            opacity: 0;
        }
        .toggleFullScreenBtn{
            position: absolute;
            bottom: 30px;
            right: rem(130px);
            padding: rem(6px);
            z-index: 1;
            font-size: 0;
            width: rem(40px);
            height: rem(40px);
            background: url('~@/assets/images/quotation/pen.png') center center no-repeat;
            background-size: 100% auto;
        }
    }
}

.TSArea{
    width: 7.2rem; margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

#tv_chart_container {
    flex: 1;
    ::v-deep {
        iframe {
            width: 100%;
        }
    }
}

.study-area {
    width: 100%;
    height: .45rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
    .main-study,
    .side-study {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: flex-end;
        flex: 1;
        overflow-x: auto;
        height: 100%;
        .content {
            display: flex;
            justify-content: space-between;
            flex: 1;
            padding: 0;
            .item {
                display: flex;
                justify-content: center;
                color: #646566;
                font-size: .22rem;
                flex: 1;
                text-align: center;
                &.active {
                    color: $primary;
                }
                &.disabled {
                    color: $muted;
                }
                .inner-label{
                    line-height: .45rem;
                    font-size: .22rem;
                }
            }
        }
    }
    .split {
        display: block;
        flex: 0 0 1px;
        height: rem(30px);
        margin: 0 rem(20px);
        background: #f8f8f8;
    }
}
.setting {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: .6rem;
    .icon {
        font-size: .22rem;
    }
    .content {
        position: absolute;
        right: 0;
        top: .53rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-items: flex-start;
        background: #fff;
        z-index: 10;
        box-shadow: 0 0 .1rem 0 #ebedf0;
        padding: .15rem 0;
        border-radius: .1rem; overflow: hidden;
        .item {
            white-space: nowrap;
            line-height: .2rem;
            padding: .1rem .2rem .1rem .2rem;
            font-size: .22rem;
            &.active {
                ::v-deep {
                    &.van-checkbox__icon--disabled{
                        .van-icon {
                            background-color: #ebedf0;
                            border-color: #c8c9cc;
                        }
                    }
                    .van-icon {
                        border-color: $primary;
                        background-color: $primary;

                    }
                    .van-checkbox__label {
                        color: $primary;
                        font-size: .22rem;
                        &.van-checkbox__label--disabled{
                            color: #c8c9cc;
                        }
                    }
                }
            }
        }
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;
        opacity: 0;
    }
}

.horizontal{
    // 真横屏
    @media screen and (orientation: landscape) {
        .TV-area, .popup-wrap{
            transform: none!important;
            top: 0!important;
            left: 0!important;
            // width: 100%!important;
            // height: 100%!important;
        }

        // .toggleHorizontalBtn{
        //     bottom: rem(55px);
        //     right: rem(150px);
        //     padding: rem(6px);
        //     z-index: 100;
        //     font-size: 0;
        // }
    }
}

.horizontal{
    .TV-area{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        transform: rotate(90deg);
        background: #fff;
        overflow: hidden;
        #tv_chart_container{
            ::v-deep iframe{
                width: 100%;
                height: 100%;
            }
        }
    }
    .popup-wrap{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        transform: rotate(90deg);
    }
}
.block-info{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: .8rem;
    background: #fff;
    box-sizing: border-box;
    padding: 0 .2rem;
    .info-l{
        font-weight: 500;
        color: #646567;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .name{
            font-size: .28rem;
            font-weight: bold;
            color: #333333;
        }
        .code {
            font-size: .24rem;
            margin-left: .18rem;
        }
        .interval{
            font-size: .24rem;
            border: 1px solid #E0E3EB;
            border-radius: .04rem;
            padding: 0 .2rem;
            margin-left: .2rem;
        }
        .study{
            display: inline-block;
            width: .42rem;
            height: .36rem;
            margin-left: .18rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .iconfont{
                font-size: .3rem;
            }
        }
    }
    .info-r{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        flex-wrap: nowrap;
        font-size: .24rem;
        font-weight: 500;
        color: #646567;
        .s{
            margin-right: .2rem;
        }
    }
}
// .toggleHorizontalBtn{
//     position: fixed;
//     bottom: rem(150px);
//     right: rem(640px);
//     padding: rem(6px);
//     z-index: 100;
//     font-size: 0;
//     width: rem(40px);
//     height: rem(40px);
//     background: url('~@m/images/zoomOut.png')center center no-repeat;
//     background-size: auto 66%;
//     border: solid 1px #000;
// }

.block-interval{
    display: flex;
    flex-direction: row;
    height: 100%;
    .main, .sub{
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        height: 100%;
        font-size: .28rem;
        .title{
            font-weight: 500;
            color: #000001;
            margin: rem(30px) rem(40px);
        }
        .content{
            flex: 1;
            overflow-y: auto;
            .item{
                margin: rem(20px) 0;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                &.active {
                    color: $primary;
                }
                &.disabled {
                    color: $muted;
                }

                .inner-label{
                    display: inline-block;
                    flex: 1;
                    height: rem(50px);
                    line-height: rem(45px);
                    min-width: rem(130px);
                    margin: 0 rem(30px) 0 rem(30px);
                }
                .sign{
                    margin: 0 .3rem;
                }
            }
        }

    }
}

.block-cycle{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    justify-content: space-between;
    font-size: .22rem;
    padding: .2rem 0; box-sizing: border-box;
    .item{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        &.active{
            .inner-label{
                color: $primary;
            }
        }
        .inner-label{
            display: inline-block;
            flex: 1;
            height: .5rem;
            line-height: .5rem;
            margin: 0 .3rem 0 .3rem;
            font-size: .22rem;
        }
        .sign{
            margin: 0 .3rem 0 0;
        }
    }
}

.price_box{ display: flex; box-sizing: border-box; padding: .22rem .38rem .22rem .38rem; justify-content: space-between; align-items: center; }
.price_box .price_left { width: 45%; text-align: left; display: flex; flex-wrap: wrap; }

.price_box .price_left span{ font-weight: bold; font-size: .49rem; line-height: .49rem; display: flex; align-items: center;}
.price_box .price_left span em{ width: .18rem; height: .27rem; margin: 0 0 0 .1rem; background-size: 100%;}

.price_box .price_left p{ font-size: .24rem; line-height: .24rem; width: 100%; margin-top: .02rem; }
.price_box .price_left p label{display: inline; margin-left: .28rem; }
.price_box .price_left p i{display: none;}
.price_box .price_left p.rise i{display: inline; }

.price_box .price_right { width: 55%; padding: .15rem 0;}
.price_box .price_right ul{ width: 100%; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; }
.price_box .price_right ul li{ font-size: .26rem; margin: .02rem 0; width: 50%;}
.price_box .price_right ul li span{ display: inline; }

</style>
