import { Link } from 'react-router-dom';

const Product = ({ Name, Description, Price, main }) => {
    return (
        <Link to={`/product/`} className="flex flex-col items-center gap-1.5 p-6 cursor-pointer">
            <div className="w-36 h-36 transform hover:scale-110 transition-transform duration-150 ease-out">
                <img draggable="false" className="w-full h-full object-contain" src={main} alt={Name} />
            </div>
            <h2 className="font-medium text-sm mt-2">{Name}</h2>
            {/* The Price from the database can be displayed here. */}
            <span className="text-primary-green text-sm">₹{Price}</span>
            {/* The Description from the database can be used as a tag. */}
            <span className="text-stone text-sm">{Description}</span>
        </Link>
    );
};

export default Product;