
const ScrollBanner = () => {

    let groupContent = (
        <>
            <li>WELCOME TO HOPNET.ORG</li>
            <li>PLEASE READ THE RULES</li>
            <li>BE RESPECTFUL OF OTHERS</li>
            <li>I KNOW MARQUEES ARE DEPRECATED</li>
            <li>IT'S A STYLISTIC CHOICE</li>
        </>
    );

    return (
        <div id="scroll-banner" aria-hidden="true">
            <ul className="banner-group">
                {groupContent}
            </ul>
            <ul className="banner-group">
                {groupContent}
            </ul>
        </div>
    );
};

export default ScrollBanner;