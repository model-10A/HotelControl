<template>
	<div class="editor-area" :class="isFull ? 'full' : ''" :style="{ width, height }">
		<div class="tools">
			<el-tooltip placement="right" :content="isFull ? '缩小' : '放大'">
				<div class="expand" @click="isFull = !isFull">
					<svg-icon :icon="isFull ? 'icon-compress' : 'icon-expend'"></svg-icon>
				</div>
			</el-tooltip>
			<el-tooltip v-show="false" placement="right" content="格式化">
				<div v-show="false" class="expand" @click="onFormatDoc">
					<svg-icon icon="icon-border-outer"></svg-icon>
				</div>
			</el-tooltip>
		</div>
	</div>
</template>

<script lang="ts">
import useCodeText from './useCodeText'
import { defineComponent, ref } from 'vue'

export default defineComponent({
	props: {
		width: {
			type: String,
			default: '100%'
		},
		height: {
			type: String,
			default: '90vh'
		},
		language: {
			type: String,
			default: 'javascript'
		},
		preComment: {
			type: String,
			default: ''
		},
		modelValue: {
			type: String,
			default: ''
		},
		editorOptions: {
			type: Object,
			default: () => ({})
		}
	},
	setup(props) {
		const { updateVal, getEditor, createEditor, onFormatDoc } = useCodeText(props.language)
		const isFull = ref(false)
		return {
			isFull,
			updateVal,
			getEditor,
			createEditor,
			onFormatDoc
		}
	},
	watch: {
		modelValue(val) {
			val !== this.getEditor()?.getValue() && this.updateMonacoVal(val)
		}
	},
	mounted() {
		if (this.$el) {
			const monacoEditor = this.createEditor(this.$el, this.$props.editorOptions)
			this.updateMonacoVal()
			monacoEditor!.onDidChangeModelContent(() => {
				this.$emit('update:modelValue', monacoEditor!.getValue())
			})
			monacoEditor!.onDidBlurEditorText(() => {
				this.$emit('blur')
			})
		}
	},
	methods: {
		updateMonacoVal(_val?: string) {
			const { modelValue, preComment } = this.$props
			const val = preComment ? `${preComment}\n${_val || modelValue}` : _val || modelValue
			this.updateVal(val)
		}
	}
})
</script>

<style lang="scss" scoped>
.editor-area {
	position: relative;
	border: 1px solid #ddd;
	border-radius: 4px;
	overflow: hidden;
	padding: 5px;
	background-color: #fff;
	box-sizing: border-box;
	&.full {
		position: fixed;
		left: calc(10vw / 2);
		top: calc(10vh / 2);
		box-shadow: 0 0 22px 10px rgba(0, 0, 0, 0.3);
		width: 90vw !important;
		height: 90vh !important;
		z-index: 9999;
	}
	.tools {
		z-index: 888;
		position: absolute;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 0 2px;
		border-right: 1px solid rgba(0, 0, 0, 0.1);
		left: 0;
		bottom: 0px;
		top: 0;
		.expand {
			cursor: pointer;
			line-height: 0;
			margin-top: 5px;
		}
	}
}
</style>
