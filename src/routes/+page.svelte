<script>
    import { onMount } from "svelte";

    // Components
    import NavigationBar from "$lib/NavigationBar/NavigationBar.svelte";
    import NavigationDivider from "$lib/NavigationBar/Divider.svelte";
    import NavigationButton from "$lib/NavigationBar/Button.svelte";
    import StyledButton from "$lib/StyledComponents/ToolboxButton.svelte";

    // Modals
    import ExtensionColorsModal from "$lib/MenuModals/ExtensionColors.svelte";
    import CreateBlockModal from "$lib/MenuModals/CreateBlock.svelte";

    // Modal Scripts
    import CreateBlockModalScript from "$lib/MenuModals/createblock.js";

    // Toolbox
    import Toolbox from "$lib/Toolbox/Toolbox.xml?raw";

    import JSZip from "jszip";
    import beautify from "js-beautify";
    import Prism from "prismjs";
    import * as FileSaver from "file-saver";
    import fileDialog from "../resources/fileDialog";
    import EventManager from "../resources/events";

    import Blockly from "blockly/core";
    import * as ContinuousToolboxPlugin from "@blockly/continuous-toolbox";
    const Theme = Blockly.Theme.defineTheme("BasicTheme", {
        base: Blockly.Themes.Classic,
        fontStyle: {
            family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            weight: "600",
            size: 12,
        },
        startHats: true,
    });

    import En from "blockly/msg/en";
    import "blockly/blocks";

    import BlocklyComponent from "svelte-blockly";

    import Compiler from "../resources/compiler";
    import preload from "../resources/preload";

    // Blocks
    import registerGeneric from "../resources/blocks/generic.js";
    registerGeneric();

    import registerCore from "../resources/blocks/core.js";
    import registerControl from "../resources/blocks/control.js";
    registerCore();
    registerControl();

    const en = {
        rtl: false,
        msg: {
            ...En,
        },
    };

    const config = {
        toolbox: Toolbox,
        collapse: true,
        comments: true,
        scrollbars: true,
        disable: false,
        theme: Theme,
        renderer: "zelos",
        grid: {
            spacing: 25,
            length: 3,
            colour: "#00000011",
            snap: false,
        },
        zoom: {
            controls: true,
            wheel: false,
            startScale: 0.8,
            maxScale: 4,
            minScale: 0.25,
            scaleSpeed: 1.1,
        },
        plugins: {
            toolbox: ContinuousToolboxPlugin.ContinuousToolbox,
            flyoutsVerticalToolbox: ContinuousToolboxPlugin.ContinuousFlyout,
            metricsManager: ContinuousToolboxPlugin.ContinuousMetrics,
        },
        move: {
            scrollbars: {
                horizontal: true,
                vertical: true,
            },
            drag: true,
            wheel: true,
        },
    };

    let workspace;
    let compiler;
    let projectName = "";
    let projectID = "";
    let lastGeneratedCode = "";

    const extensionMetadata = {
        name: "code"
    }

    function updateGeneratedCode() {
        const code = compiler.compile(
            workspace
        );
        lastGeneratedCode = code;
    }
    onMount(() => {
        console.log("ignore the warnings above we dont care about those");

        window.onbeforeunload = () => "";
        compiler = new Compiler(workspace);
        // workspace was changed
        workspace.addChangeListener(updateGeneratedCode);

        EventManager.allowAttachment();
        EventManager.on(EventManager.EVENT_THEME_CHANGED, () => {
            workspace.refreshTheme();
        });
    });

    let fileMenu;
    function showFileMenu() {
        if (fileMenu.style.display == "none") {
            fileMenu.style.display = "";
            return;
        }
        fileMenu.style.display = "none";
    }

    function downloadProject() {
        // generate file name
        let filteredProjectName = projectName.replace(/[^a-z0-9\-]+/gim, "_");
        let fileName = filteredProjectName + ".tbext";
        if (!filteredProjectName) {
            fileName = "MyProject.tbext";
        }

        // data
        const projectData = State.serializeProject(State.currentProject);

        // zip
        const zip = new JSZip();
        zip.file(
            "README.txt",
            "This file is not meant to be opened!" +
                "\nBe careful as you can permanently break your project!"
        );

        // workspaces
        const workspaces = zip.folder("workspaces");
        for (const character of State.currentProject.characters) {
            workspaces.file(character.id + ".xml", character.xml);
        }

        // data
        const data = zip.folder("data");
        data.file("project.json", projectData);

        // download
        zip.generateAsync({ type: "blob" }).then((blob) => {
            FileSaver.saveAs(blob, fileName);
        });
    }
    function loadProject() {
        fileDialog({ accept: ".tbext" }).then((files) => {
            if (!files) return;
            const file = files[0];

            // set project name
            const projectNameIdx = file.name.lastIndexOf(".tbext");
            projectName = file.name.substring(0, projectNameIdx);

            JSZip.loadAsync(file.arrayBuffer()).then(async (zip) => {
                console.log("loaded zip file...");

                // get project json from the data folder
                const dataFolder = zip.folder("data");
                const projectJsonString = await dataFolder
                    .file("project.json")
                    .async("string");
                const projectJson = JSON.parse(projectJsonString);

                // get project workspace xml stuffs
                const workspacesFolder = zip.folder("workspaces");
                const fileNames = [];
                workspacesFolder.forEach((_, file) => {
                    const fileName = file.name.replace("workspaces/", "");
                    fileNames.push(fileName);
                });
                // console.log(fileNames); // debug
                const idWorkspacePairs = {};
                for (const fileName of fileNames) {
                    const idx = fileName.lastIndexOf(".xml");
                    const id = fileName.substring(0, idx);
                    // assign to pairs
                    idWorkspacePairs[id] = await workspacesFolder
                        .file(fileName)
                        .async("string");
                }
                // console.log(idWorkspacePairs); // debug

                // laod
                console.log(projectJson); // debug
                State.loadProject(projectJson, idWorkspacePairs);
            });
        });
    }

</script>

<CreateBlockModal
    color1={extensionMetadata.color1}
    color2={extensionMetadata.color2}
    color3={extensionMetadata.color3}
/>

<NavigationBar>
    <NavigationButton>File</NavigationButton>
    <NavigationButton>Edit</NavigationButton>
    <NavigationDivider />
    <NavigationDivider />
    <input
        class="project-name"
        type="text"
        placeholder="Extension Name (ex: Extension)"
        style="margin-left:4px;margin-right:4px"
        bind:value={projectName}
        on:change={updateGeneratedCode}
    />
</NavigationBar>
<div class="main">
    <div class="row-menus">
        <div class="row-first-submenus">
            <div class="blocklyWrapper">
                <BlocklyComponent {config} locale={en} bind:workspace />
            </div>
        </div>
        <div class="row-submenus">
            <div class="row-subsubmenus">
                <div class="codeActionsWrapper">
                    <p style="margin-right: 12px"><b>Assembly Code</b></p>
                    <StyledButton
                        on:click={() => {
                            // copy code
                            navigator.clipboard.writeText(lastGeneratedCode);
                        }}
                    >
                        Copy
                    </StyledButton>
                    <div style="margin-right: 12px" />
                    <StyledButton
                        on:click={() => {

                            const filteredProjectName = projectName.replace(
                                /[^a-z0-9\-]+/gim,
                                "_"
                            );
                            const blob = new Blob([lastGeneratedCode], {
                                type: "text/javascript;charset=UTF-8",
                            });
                            FileSaver.saveAs(blob, filteredProjectName + ".js");
                        }}
                    >
                        Download
                    </StyledButton>
                </div>
                <div class="codeWrapper">
                    <div class="codeDisplay">
                        {@html lastGeneratedCode}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :root {
        --nav-height: 3rem;
    }

    :global(body.dark) input[type="text"] {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.7);
        color: white;
    }
    :global(body.dark) input[type="text"]:hover {
        background: transparent;
        border: 1px solid dodgerblue;
    }

    .main {
        position: absolute;
        left: 0px;
        top: var(--nav-height);
        width: 100%;
        height: calc(100% - var(--nav-height));

        min-width: 870px;
    }

    .project-name {
        width: 236px;

        font-size: 20px;

        border-radius: 6px;
        outline: 1px dashed rgba(0, 0, 0, 0.15);
        border: 0;
        background: rgba(255, 255, 255, 0.25);
        color: white;

        font-weight: bold;
        font-size: 1rem;
        padding: 0.5rem;
        transition: 0.25s;
    }
    .project-name::placeholder {
        font-weight: normal;
        color: white;
        opacity: 1;
        font-style: italic;
    }
    .project-name:hover {
        background-color: hsla(0, 100%, 100%, 0.5);
        transition: 0.25s;
    }
    .project-name:active,
    .project-name:focus {
        outline: none;
        border: 1px solid hsla(0, 100%, 100%, 0);
        box-shadow: 0 0 0 calc(0.5rem * 0.5) hsla(0, 100%, 100%, 0.25);
        background-color: hsla(0, 100%, 100%, 1);
        color: black;
        transition: 0.25s;
    }

    .row-menus {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .row-submenus {
        display: flex;
        flex-direction: column;
        width: 35%;
        height: 100%;
    }
    .row-first-submenus {
        display: flex;
        flex-direction: column;
        width: 65%;
        height: 100%;
    }
    .row-subsubmenus {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .blocklyWrapper {
        position: relative;
        width: 100%;
        height: calc(100% - 48px);
    }
    .codeActionsWrapper {
        position: relative;
        width: 100%;
        height: 48px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        background: #f9f9f9;
    }
    :global(body.dark) .codeActionsWrapper {
        background-color: #111;
    }
    .codeWrapper {
        position: relative;
        width: 100%;
        height: 100%
    }

    .codeDisplay {
        width: 100%;
        height: 100%;

        border: 0;
        padding: 0;
        overflow: auto;

        background: #f1f1f1;
        white-space: pre-wrap;
        font-family: monospace !important;
    }
    :global(body.dark) .codeDisplay {
        background-color: #222;
    }

</style>
