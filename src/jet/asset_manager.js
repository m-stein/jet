import { AudioFile } from 'jet/audio_file.js';
import { ImageFile } from 'jet/image_file.js';

export class AssetManager {
    /**
     * @param {HTMLDocument} document
     * @param {string} rootPath
     */
    constructor(document, rootPath) {
        this._rootPath = rootPath;
        this._document = document;
        /** @type {{path: string, id: string, obj: AudioFile | null}[]} */
        this._pendingAudioAssets = [];
        /** @type {{path: string, id: string, obj: ImageFile | null}[]} */
        this._pendingImgAssets = [];
        /** @type {Object<string, AudioFile>} */
        this._audioAssets = {};
        /** @type {Object<string, ImageFile>} */
        this._imgAssets = {};
    }

    /**
     * @param {(() => void)} finishedFn
     */
    loadAssets(finishedFn) {
        this._loadingFinishedFn = finishedFn;
        for (const asset of this._pendingImgAssets) {
            if (!asset.obj) {
                asset.obj = new ImageFile(
                    this._document,
                    this._rootPath + asset.path,
                    this._onAssetLoaded
                );
            }
        }
        for (const asset of this._pendingAudioAssets) {
            if (!asset.obj) {
                asset.obj = new AudioFile(
                    this._document,
                    this._rootPath + asset.path,
                    this._onAssetLoaded
                );
            }
        }
    }

    /**
     * @param {{path: string, id: string, obj: AudioFile | ImageFile | null}[]} pendingAssets
     * @param {{path: string, id: string}[]} assets
     */
    _addAssets(pendingAssets, assets) {
        for (const asset of assets) {
            pendingAssets.push({
                id: asset.id,
                path: asset.path,
                obj: null,
            });
        }
    }

    /**
     * @param {{path: string, id: string}[]} assets
     */
    addAudioAssets(assets) {
        this._addAssets(this._pendingAudioAssets, assets);
    }

    /**
     * @param {{path: string, id: string}[]} assets
     */
    addImageAssets(assets) {
        this._addAssets(this._pendingImgAssets, assets);
    }

    /**
     * @param {ImageFile | AudioFile} assetObj
     * @param {{path: string, id: string, obj: AudioFile | ImageFile | null}[]} pendingAssets
     * @param {Object<string, AudioFile | ImageFile>} loadedAssets
     */
    _markAssetLoaded(assetObj, pendingAssets, loadedAssets) {
        const idx = pendingAssets.findIndex((item) => {
            return item.obj == assetObj;
        });
        const asset = pendingAssets[idx];
        loadedAssets[asset.id] = assetObj;
        pendingAssets.splice(idx, 1);
    }

    /**
     * @param {ImageFile | AudioFile} assetObj
     */
    _onAssetLoaded = (assetObj) => {
        if (assetObj instanceof ImageFile) {
            this._markAssetLoaded(
                assetObj,
                this._pendingImgAssets,
                this._imgAssets
            );
        } else if (assetObj instanceof AudioFile) {
            this._markAssetLoaded(
                assetObj,
                this._pendingAudioAssets,
                this._audioAssets
            );
        }
        if (
            this._pendingImgAssets.length == 0 &&
            this._pendingAudioAssets.length == 0 &&
            this._loadingFinishedFn
        ) {
            this._loadingFinishedFn();
        }
    };

    /**
     * @param {string} path
     * @returns {AudioFile}
     */
    audioAsset(path) {
        if (!Object.hasOwn(this._audioAssets, path)) {
            throw Error(`Attempt to access unloaded audio asset: ${path}`);
        }
        return this._audioAssets[path];
    }

    /**
     * @param {string} path
     * @returns {ImageFile}
     */
    imageAsset(path) {
        if (!Object.hasOwn(this._imgAssets, path)) {
            throw Error(`Attempt to access unloaded image asset: ${path}`);
        }
        return this._imgAssets[path];
    }
}
