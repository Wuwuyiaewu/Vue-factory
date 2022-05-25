<template>
    <van-popup
        :close-on-click-overlay='false'
        closeable
        :get-container='getContainer'
        round
        :value='show'
        @click-close-icon='onClose'
        @closed='closed'
        class="studyList"
    >
        <div class='content'>
            <span class='type'>{{ $t('productInfo.mainStudy') }}</span>
            <!-- :style="{ 'font-size': (1/item.label.length/6) + 24/75+'rem' }" -->
            <div class='list'>
                <span
                    v-for='(item, i) in MAINSTUDIES'
                    :key='i'
                    class='item of-1px'
                    :class="{ 'active': mainStudy === item.name }"
                    @touchend='onClick("main", item.name)'
                >
                    {{ item.label }}
                </span>
            </div>

            <span class='type'>{{ $t('productInfo.subStudy') }}</span>
            <div class='list'>
                <span
                    v-for='(item, i) in SUBSTUDIES'
                    :key='i'
                    class='item of-1px'
                    :class="{ 'active': subStudy === item.name }"
                    @touchend='onClick("sub", item.name)'
                >
                    {{ item.label }}
                </span>
                <span v-for='item in (5 - SUBSTUDIES.length %5)' :key='"other" + item' class='item of-1px' style='opacity:0'></span>
            </div>

            <div class='submit' @click='onSubmit'>
                {{ $t('compLang.confirm') }}
            </div>
        </div>
    </van-popup>
</template>

<script>
import { MAINSTUDIES, SUBSTUDIES } from '../constant'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        propMainStudy: {
            type: String,
            default: ''
        },
        propSubStudy: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            MAINSTUDIES,
            SUBSTUDIES,
            list: [],
            mainStudy: '',
            subStudy: '',
        }
    },
    watch: {
        propMainStudy: {
            immediate: true,
            handler (val) {
                const study = this.MAINSTUDIES.find(e => e.name === val)
                this.mainStudy = study ? val : null
            }
        },
        propSubStudy: {
            immediate: true,
            handler (val) {
                const study = this.SUBSTUDIES.find(e => e.name === val)
                this.subStudy = study ? val : null
            }
        }
    },
    methods: {
        onSubmit () {
            if (this.mainStudy !== this.propMainStudy) {
                this.$emit('removeStudy', 'main')
                this.$emit('createStudy', 'main', this.mainStudy)
            }

            if (this.subStudy !== this.propSubStudy) {
                this.$emit('removeStudy', 'sub')
                this.$emit('createStudy', 'sub', this.subStudy)
            }

            this.onClose()
        },
        onClose () {
            this.$emit('update:show', false)
        },
        closed () {
            this.mainStudy = this.propMainStudy
            this.subStudy = this.propSubStudy
        },
        onClick (type, name) {
            switch (type) {
                case 'main': {
                    this.mainStudy = this.mainStudy === name ? '' : name
                    break
                }
                case 'sub': {
                    this.subStudy = this.subStudy === name ? '' : name
                    break
                }
            }
        },
        getContainer () {
            return document.body
        }
    }
}
</script>

<style lang="scss">
@import "@/assets/sass/mixin.scss";
.studyList.van-popup {
    width: 90%;
    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: .5rem .2rem .5rem .2rem;
        box-sizing: border-box;
        .type{
            padding: .1rem 0 .1rem 0;
            font-size: .26rem;
        }
        .list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: .2rem;
            .item {
                width: 19%;
                line-height: .45rem;
                box-sizing: border-box;
                border: 1px solid #d7d7d7;
                font-size: .2rem;
                font-weight: normal;
                text-align: center;
                margin: .05rem 0;
                &.active{
                    color: #fff;
                    background: $primary;
                    border-color: $primary;
                }
            }
        }
        .submit{
            width: 100%;
            height: .6rem;
            line-height: .6rem;
            margin-top: .2rem;
            text-align: center;
            background: $primary;
            color:#fff;
            box-sizing: border-box;
            font-size: .2rem;
            border-radius: .06rem;
        }
    }
}

.studyList .van-popup__close-icon--top-right{
    top: .16rem; right: .16rem;
}
.studyList .van-popup__close-icon{
    font-size: .26rem;
}
</style>
