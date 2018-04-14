// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

// Material Icons
import LocationOn from 'material-ui-icons/LocationOn';
import MoreHoriz from 'material-ui-icons/MoreHoriz';
import DirectionsBike from 'material-ui-icons/DirectionsBike';
import DirectionsCar from 'material-ui-icons/DirectionsCar';
import DirectionsWalk from 'material-ui-icons/DirectionsWalk';

// Our custom avatars
import LibraryAvatar from './LibraryAvatar';

// Helpers
import * as libraries from './helpers/libraries';

// Use moment for opening hours
import moment from 'moment';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	progress: {
		marginRight: theme.spacing.unit
	},
});

class LibraryCard extends React.Component {
	state = {
	}
	componentDidMount = () => {
	}
	render() {
		const { classes, library } = this.props;
		return (
			<Card className={classes.card} elevation={0}>
				<CardHeader
					avatar={
						<LibraryAvatar
							library={library} />
					}
					action={
						<div>
							<IconButton onClick={(e) => this.props.goTo([library.longitude, library.latitude])}>
								<LocationOn />
							</IconButton>
							{this.props.more_option ?
								<IconButton onClick={() => this.props.viewLibrary(library.name)}>
									<MoreHoriz />
								</IconButton> : null}
						</div>
					}
					title={library.name}
					subheader={library.address_1}
				/>
				<CardContent>
					<Typography>{libraries.checkLibraryOpen(library, this.props.current_time).message}</Typography>
				</CardContent>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[library.name] &&
							this.props.isochrones[library.name]['walking'] &&
							this.props.isochrones[library.name]['walking'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(library.name, 'walking')}>
					{this.props.isochrones &&
						this.props.isochrones[library.name] &&
						this.props.isochrones[library.name]['walking'] ?
						(this.props.isochrones[library.name]['walking'].retrieved ?
							<DirectionsWalk className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsWalk className={classes.leftIcon} />}
					{library.walking_duration ? Math.round(library.walking_duration / 60) : ''}
				</Button>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[library.name] &&
							this.props.isochrones[library.name]['cycling'] &&
							this.props.isochrones[library.name]['cycling'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(library.name, 'cycling')}>
					{this.props.isochrones &&
						this.props.isochrones[library.name] &&
						this.props.isochrones[library.name]['cycling'] ?
						(this.props.isochrones[library.name]['cycling'].retrieved ?
							<DirectionsBike className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsBike className={classes.leftIcon} />}
					{library.cycling_duration ? Math.round(library.cycling_duration / 60) : ''}
				</Button>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[library.name] &&
							this.props.isochrones[library.name]['driving'] &&
							this.props.isochrones[library.name]['driving'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(library.name, 'driving')}>
					{this.props.isochrones &&
						this.props.isochrones[library.name] &&
						this.props.isochrones[library.name]['driving'] ?
						(this.props.isochrones[library.name]['driving'].retrieved ?
							<DirectionsCar className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsCar className={classes.leftIcon} />}
					{library.driving_duration ? Math.round(library.driving_duration / 60) : ''}
				</Button>
			</Card>
		);
	}
}

LibraryCard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LibraryCard);