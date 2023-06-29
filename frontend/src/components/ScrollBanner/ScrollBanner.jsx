
const ScrollBanner = () => {

    let groupContent = (
        <>
            <li>WELCOME TO HOPNET</li>
            <li>PLEASE READ THE RULES</li>
            <li>ENJOY YOUR STAY</li>
        </>
    );

    return (
        <div id="scroll-banner">
            <ul className="banner-group">
                {groupContent}
            </ul>
            <ul className="banner-group" aria-hidden="true">
                {groupContent}
            </ul>
        </div>
    );
};

export default ScrollBanner;