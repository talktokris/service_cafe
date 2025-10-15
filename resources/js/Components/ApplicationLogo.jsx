export default function ApplicationLogo(props) {
    return (
        <div {...props} className="flex items-center justify-center">
            <img
                src="/assets/logo.png"
                alt="Serve Cafe Logo"
                className="w-full h-full object-contain"
            />
        </div>
    );
}
