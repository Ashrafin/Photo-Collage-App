import React from 'react';
import ReactGallery from 'reactive-blueimp-gallery';

const Photo = (props) => {
	let image = [
		{ source: props.largeImage }
	];

	return (
		<div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2 grid-item">
			<div className="image-wrapper">
				<img id="image" className="image" src={props.mediumImage} alt="" />
				<ReactGallery
					source={image}
				/>
				<a href={props.url} className="name-wrapper">
					<p id="name" className="name mb-0 righteous">{props.photographer}</p>
				</a>
			</div>
		</div>
	);
};

export default Photo;
