<script lang="ts">
    import { Pager } from '@nativescript-community/ui-pager';
    import { ApplicationSettings, Page } from '@nativescript/core';
    import { QRCodeData } from 'plugin-nativeprocessor';
    import { closeModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import CropView from '~/components/common/CropView.svelte';
    import { lc } from '~/helpers/locale';
    import { DOCUMENT_NOT_DETECTED_MARGIN } from '~/models/constants';
    import { navigationBarHeight } from '~/variables';
    import PageIndicator from './common/PageIndicator.svelte';
    import { ImportImageData } from '~/models/OCRDocument';

    let page: NativeViewElementNode<Page>;
    let pager: NativeViewElementNode<Pager>;

    export let items: ImportImageData[] = [];
    // export let editingImage;
    // export let quads;
    // export let qrcode: QRCodeData = null;
    function onTapFinish() {
        closeModal(items);
    }
    let currentIndex = 0;
    function onSelectedIndex(event) {
        currentIndex = event.object.selectedIndex;
        DEV_LOG && console.log('onSelectedIndex', currentIndex, items.length);
    }
    function changePage(delta) {
        currentIndex += delta;
    }

    function resetCrop() {
        const item = items[currentIndex];
        // const editingImage = item.editingImage;
        item.quads = item.quads.map((quad) => [
            [0, 0],
            [item.imageWidth - 0, 0],
            [item.imageWidth - 0, item.imageHeight - 0],
            [0, item.imageHeight - 0]
        ]);
        pager.nativeView.refreshVisibleItems();
    }
</script>

<page bind:this={page} id="modalImport" actionBarHidden={true} statusBarStyle="dark">
    <gridlayout backgroundColor="black" columns="auto,*,auto" rows="auto,*,auto,auto,auto" android:paddingBottom={$navigationBarHeight}>
        <pager bind:this={pager} id="pager" colSpan={3} disableSwipe={true} {items} row={1} selectedIndex={currentIndex} transformers="zoomOut" on:selectedIndexChange={onSelectedIndex}>
            <Template let:item>
                <CropView {...item} />
            </Template>
        </pager>
        <PageIndicator colSpan={3} horizontalAlignment="right" margin="10 10 0 0" row={2} text={`${currentIndex + 1}/${items.length}`} />
        <mdbutton
            class="icon-btn"
            color="white"
            fontSize={46}
            horizontalAlignment="left"
            rippleColor="white"
            row={3}
            text="mdi-chevron-left"
            variant="text"
            verticalAlignment="center"
            visibility={currentIndex > 0 ? 'visible' : 'hidden'}
            on:tap={() => changePage(-1)} />
        <label col={1} color="white" fontSize={13} row={3} text={lc('crop_edit_doc')} textAlignment="center" textWrap={true} verticalAlignment="center" />
        <mdbutton
            class="icon-btn"
            col={2}
            color="white"
            fontSize={46}
            horizontalAlignment="right"
            rippleColor="white"
            row={3}
            text="mdi-chevron-right"
            variant="text"
            verticalAlignment="center"
            visibility={currentIndex < items.length - 1 ? 'visible' : 'hidden'}
            on:tap={() => changePage(1)} />
        <mdbutton class="fab" colSpan={3} elevation={0} horizontalAlignment="center" row={4} text="mdi-check" variant="text" on:tap={onTapFinish} />
        <mdbutton
            class="icon-btn"
            colSpan={3}
            color="white"
            horizontalAlignment="right"
            marginRight={10}
            row={4}
            text="mdi-arrow-expand-all"
            variant="text"
            verticalAlignment="center"
            on:tap={resetCrop} />
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" colSpan={3} modalWindow={true} title={null} />
    </gridlayout>
</page>
