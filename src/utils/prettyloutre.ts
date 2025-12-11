export function parseTitle(text: string = ""): string {// Component: src/components/Composant.astro
    // Component used to separate different sections of a page, with an enhanced title.
    // The title accepts special codes:
    //
    //  #_text_#
    //      → inserts a <span> containing "text"
    //        classes: textColorGradientShift textAnimatedUnderlineGradient
    //
    //  #text#
    //      → inserts a <span> containing "text"
    //        classes: textColorGradientShift
    //
    //  ![image_name]
    //      → inserts an image located at ../../assets/titles/image_name.webp
    //        class: inline-image
    //

    // console.log("INPUT TITLE =", text);

    return text
        // %text%
        .replace(
            /%\s*([^%]+?)\s*%/g,
            '<span class="special-font-titles">$1</span>'
        )

        // #_text_#
        .replace(
            /#_\s*([^_]+?)\s*_#/g,
            '<span class="text-color-gradient-animated text-animated-underline-gradient">$1</span>'
        )

        // #text#
        .replace(
            /#([^#]+)#/g,
            '<span class="text-color-gradient-animated">$1</span>'
        )

        // ![image]
        .replace(
            /!\[([^\]]+)]/g,
            (_, name) =>
                `<span class="inline-image"><img src="${name}" alt="${name}" /></span>`
        );
}