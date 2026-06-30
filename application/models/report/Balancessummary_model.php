<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Balancessummary_model extends CI_Model {
  
	/** Account Card _module
		* [Developer]
		* Developer: Roj Zim Jamil Actub Janubas
		* Date Created: May 14, 2018
		* Date Finished: 
		
		* [Database]
			
			
		* [Description]
		* 	This _module is created for students transsactions for payments and their current status per year.
		* [Modification]
		
		**/
		
	public function __construct()
    {
        parent::__construct();
		$this->load->database(); 
	}
	
	public function getFilter( $params )
	{
		if ( $params[ 'sBy' ] == 0 )
		{

			$this->db->select( "gradeLevelID AS id, gradeLevelName AS name" );
			
			return $this->db->get( 'gradelevel' )->result_array();

		}
		if ( $params[ 'sBy' ] == 2 )
		{

			$this->db->select( "schoolYearID AS id, CONCAT(schoolYearStart, '-', (schoolYearStart + 1)) AS name" );
			$this->db->order_by( 'schoolYearStart', 'DESC' );
			
			return $this->db->get( 'schoolyear' )->result_array();

		}
		else 
		{

			$this->db->select( "studentID AS id, studentName AS name" );

			return $this->db->get( 'student' )->result_array();

		}

	}

	public function getBalances( $params ){
		$where = "";

		if ( !isset( $params['asOfDate'] ) ){
			$params['asOfDate'] = date('Y-m-d');
		}

		$schoolYearID = ""; 
		$accountCardSY = "";
		if ( isset( $params['sBy'] ) && $params['sBy'] == 2 && $params['filterBy'] > 0 ) 
		{
			$schoolYearID = 'AND schoolYearID = ' . $params['filterBy'];
			$accountCardSY = "WHERE accountCardSchoolYear = " . $params['filterBy'];
		}
		
		$this->db->select("
			a.studentName
			,b.gradeLevelName
			,( IFNULL( c.annualRegistrationTotalReceivable, 0 ) - IFNULL( d.annualRegistration, 0 ) ) as annualRegistration
			,( IFNULL( c.tuitionTotalReceivable, 0 ) - IFNULL( d.tuition, 0 ) ) as tuition
			,( IFNULL( c.booksTotalReceivable, 0 ) - IFNULL( d.books, 0 ) ) as books
			,( IFNULL( c.uniformTotalReceivable, 0 ) - IFNULL( d.uniform, 0 ) ) as uniform
			,( IFNULL( e.cateringTotalReceivable, 0 ) - IFNULL( d.catering, 0 ) ) as catering
			,( IFNULL( g.extraCurricularTotalReceivable, 0 ) - IFNULL( d.extraCurricular, 0 ) ) as extraCurricular
			,( IFNULL( h.christmasTotalReceivable, 0 ) - IFNULL( d.christmas, 0 ) ) as christmas
			,( IFNULL( i.familyDayTotalReceivable, 0 ) - IFNULL( d.familyDay, 0 ) ) as  familyDay
			,( IFNULL( j.pictureTotalReceivable, 0 ) - IFNULL( d.picture, 0 ) ) as picture
			,( IFNULL( k.gradFeeTotalReceivable, 0 ) - IFNULL( d.gradFee, 0 ) ) as gradFee
			,( IFNULL( l.scoutingTotalReceivable, 0 ) - IFNULL( d.scouting, 0 ) ) as scouting
			,( IFNULL( f.charityTotalReceivable, 0 ) - IFNULL( d.charity, 0 ) ) as charity
			,( IFNULL( m.othersTotalReceivable, 0 ) - IFNULL( d.others, 0 ) ) as others
			,( IFNULL( n.nutritionTotalReceivable, 0 ) - IFNULL( d.nutrition, 0 ) ) as nutrition
			,( IFNULL( o.movingUpTotalReceivable, 0 ) - IFNULL( d.movingUp, 0 ) ) as movingUp
			,(
				IFNULL( c.annualRegistrationTotalReceivable, 0 )
				+ IFNULL( c.tuitionTotalReceivable, 0 )
				+ IFNULL( c.booksTotalReceivable, 0 )
				+ IFNULL( c.uniformTotalReceivable, 0 )
				+ IFNULL( e.cateringTotalReceivable, 0 )
				+ IFNULL( g.extraCurricularTotalReceivable, 0 )
				+ IFNULL( h.christmasTotalReceivable, 0 )
				+ IFNULL( i.familyDayTotalReceivable, 0 )
				+ IFNULL( j.pictureTotalReceivable, 0 )
				+ IFNULL( k.gradFeeTotalReceivable, 0 )
				+ IFNULL( l.scoutingTotalReceivable, 0 )
				+ IFNULL( f.charityTotalReceivable, 0 )
				+ IFNULL( m.othersTotalReceivable, 0 )
				+ IFNULL( n.nutritionTotalReceivable, 0 )
				+ IFNULL( o.movingUpTotalReceivable, 0 )
			) as totalReceivables
			,(
				IFNULL( d.annualRegistration, 0 )
				+ IFNULL( d.tuition, 0 )
				+ IFNULL( d.books, 0 )
				+ IFNULL( d.uniform, 0 )
				+ IFNULL( d.catering, 0 )
				+ IFNULL( d.extraCurricular, 0 )
				+ IFNULL( d.christmas, 0 )
				+ IFNULL( d.familyDay, 0 )
				+ IFNULL( d.picture, 0 )
				+ IFNULL( d.gradFee, 0 )
				+ IFNULL( d.scouting, 0 )
				+ IFNULL( d.charity, 0 )
				+ IFNULL( d.others, 0 )
				+ IFNULL( d.nutrition, 0 )
				+ IFNULL( d.movingUp, 0 )
			) as totalPayments
			,(
				(
					IFNULL( c.annualRegistrationTotalReceivable, 0 )
					+ IFNULL( c.tuitionTotalReceivable, 0 )
					+ IFNULL( c.booksTotalReceivable, 0 )
					+ IFNULL( c.uniformTotalReceivable, 0 )
					+ IFNULL( e.cateringTotalReceivable, 0 )
					+ IFNULL( g.extraCurricularTotalReceivable, 0 )
					+ IFNULL( h.christmasTotalReceivable, 0 )
					+ IFNULL( i.familyDayTotalReceivable, 0 )
					+ IFNULL( j.pictureTotalReceivable, 0 )
					+ IFNULL( k.gradFeeTotalReceivable, 0 )
					+ IFNULL( l.scoutingTotalReceivable, 0 )
					+ IFNULL( f.charityTotalReceivable, 0 )
					+ IFNULL( m.othersTotalReceivable, 0 )
					+ IFNULL( n.nutritionTotalReceivable, 0 )
					+ IFNULL( o.movingUpTotalReceivable, 0 )
				)
				-
				(
					IFNULL( d.annualRegistration, 0 )
					+ IFNULL( d.tuition, 0 )
					+ IFNULL( d.books, 0 )
					+ IFNULL( d.uniform, 0 )
					+ IFNULL( d.catering, 0 )
					+ IFNULL( d.extraCurricular, 0 )
					+ IFNULL( d.christmas, 0 )
					+ IFNULL( d.familyDay, 0 )
					+ IFNULL( d.picture, 0 )
					+ IFNULL( d.gradFee, 0 )
					+ IFNULL( d.scouting, 0 )
					+ IFNULL( d.charity, 0 )
					+ IFNULL( d.others, 0 )
					+ IFNULL( d.nutrition, 0 )
					+ IFNULL( d.movingUp, 0 )
				)
			) as totalBalance
		");
		$this->db->join( 'gradelevel as b', 'b.gradeLevelID = a.gradeLevelID', 'left outer' );
		$this->db->join( "(
			SELECT
				studentID
				,SUM( IFNULL( annualRegistrationTotalReceivable, 0 ) ) as annualRegistrationTotalReceivable
				,SUM( IFNULL( tuitionTotalReceivable, 0 ) ) as tuitionTotalReceivable
				,SUM( IFNULL( booksTotalReceivable, 0 ) ) as booksTotalReceivable
				,SUM( IFNULL( uniformTotalReceivable, 0 ) ) as uniformTotalReceivable
			FROM accountcard
			$accountCardSY
			GROUP BY studentID
		) as c", "c.studentID = a.studentID", 'left outer' );
		$this->db->join( "(
			SELECT
				studentID
				,SUM( IFNULL( annualRegistration, 0 ) ) as annualRegistration
				,SUM( IFNULL( tuition, 0 ) ) as tuition
				,SUM( IFNULL( books, 0 ) ) as books
				,SUM( IFNULL( uniform, 0 ) ) as uniform
				,SUM( IFNULL( catering, 0 ) ) as catering
				,SUM( IFNULL( extraCurricular, 0 ) ) as extraCurricular
				,SUM( IFNULL( christmas, 0 ) ) as christmas
				,SUM( IFNULL( familyDay, 0 ) ) as familyDay
				,SUM( IFNULL( picture, 0 ) ) as picture
				,SUM( IFNULL( gradFee, 0 ) ) as gradFee
				,SUM( IFNULL( scouting, 0 ) ) as scouting
				,SUM( IFNULL( charity, 0 ) ) as charity
				,SUM( IFNULL( others, 0 ) ) as others
				,SUM( IFNULL( nutrition, 0 ) ) as nutrition
				,SUM( IFNULL( movingUp, 0 ) ) as movingUp
			FROM
				payments
			WHERE paymentDate <= '" . date( 'Y-m-d', strtotime( $params['asOfDate'] ) ) . "'
				AND ( status = 0 OR status IS NULL )
				$schoolYearID
			GROUP BY studentID
		) as d", "d.studentID = a.studentID", 'left outer' );
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as cateringTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 1 
			$schoolYearID
			GROUP BY a.studentID
		) as e", 'e.studentID = a.studentID', 'left outer' ); /* catering */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as charityTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 2
			$schoolYearID
			GROUP BY a.studentID
		) as f", 'f.studentID = a.studentID', 'left outer' ); /* charity */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as extraCurricularTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 3
			$schoolYearID
			GROUP BY a.studentID
		) as g", 'g.studentID = a.studentID', 'left outer' ); /* Extra-Curricular */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as christmasTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 4
			$schoolYearID
			GROUP BY a.studentID
		) as h", 'h.studentID = a.studentID', 'left outer' ); /* Christmas */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as familyDayTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 5
			$schoolYearID
			GROUP BY a.studentID
		) as i", 'i.studentID = a.studentID', 'left outer' ); /* Family Day */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as pictureTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 6
			$schoolYearID
			GROUP BY a.studentID
		) as j", 'j.studentID = a.studentID', 'left outer' ); /* Picture */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as gradFeeTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 7
			$schoolYearID
			GROUP BY a.studentID
		) as k", 'k.studentID = a.studentID', 'left outer' ); /* Grad Fee */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as scoutingTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 8
			$schoolYearID
			GROUP BY a.studentID
		) as l", 'l.studentID = a.studentID', 'left outer' ); /* Scouting/Camping */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as othersTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 9
			$schoolYearID
			GROUP BY a.studentID
		) as m", 'm.studentID = a.studentID', 'left outer' ); /* others */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as nutritionTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 10
			$schoolYearID
			GROUP BY a.studentID
		) as n", 'n.studentID = a.studentID', 'left outer' ); /* nutrition day */
		$this->db->join( "(
			SELECT
				a.studentID
				,SUM( IFNULL( a.receivableAmount, 0 ) ) as movingUpTotalReceivable
			FROM
				receivables as a
			LEFT OUTER JOIN batchreceivables as b
				ON( b.batchReceivableID = a.batchReceivableID )
			WHERE b.batchReceivableCategoryID = 11
			$schoolYearID
			GROUP BY a.studentID
		) as o", 'o.studentID = a.studentID', 'left outer' ); /* moving up/recognition */
		
		/* sql statement conditions here */
		if ( isset($params[ 'sBy' ]) ){
			if ( (int)$params[ 'sBy' ] == 0 && (int)$params[ 'filterBy' ] != 0 ){
				$this->db->where( 'a.gradeLevelID', $params['filterBy'] );
			}
			else if ( (int)$params[ 'sBy' ] == 1 && (int)$params[ 'filterBy' ] != 0 ){
				$this->db->where( 'a.studentID', $params['filterBy'] );
			}
		}
		$this->db->where( '(a.studentStatus = 0 OR a.studentStatus IS NULL)' );
		$this->db->group_by( 'a.studentID' );
		/* end of sql statement conditions */
		return $this->db->get( 'student as a' )->result_array();
	}
	
	public function getBalancesOld( $params )
	{

		$where = "";

		if ( isset($params[ 'sBy' ]) )
		{

			if ( (int)$params[ 'sBy' ] == 0 && (int)$params[ 'filterBy' ] != 0 )
			{
				
				$where = " WHERE b.gradeLevelID = ". $params[ 'filterBy' ] ."";

			}
			else if ( (int)$params[ 'sBy' ] == 1 && (int)$params[ 'filterBy' ] != 0 )
			{

				$where = " WHERE a.studentID = ". $params[ 'filterBy' ] ."";

			}
		
		}

		if ( !isset( $params['asOfDate'] ) )
		{

			$params['asOfDate'] = date('Y-m-d');

		}
		
		return $this->db->query("
			SELECT 
				a.*
				,@annualRegistration := @annualRegistration + a.annualRegistration AS annualRegistration1
				,@tuition := @tuition + a.tuition AS tuition1
				,@books := @books + a.books AS books1
				,@uniform := @uniform + a.uniform AS uniform1
				,@catering := @catering + a.catering AS catering1
				,@extraCurricular := @extraCurricular + a.extraCurricular AS extraCurricular1
				,@christmas := @christmas + a.christmas AS christmas1
				,@familyDay := @familyDay + a.familyDay AS familyDay1
				,@picture := @picture + a.picture AS picture1
				,@gradFee := @gradFee + a.gradFee AS gradFee1
				,@scouting := @scouting + a.scouting AS scouting1
				,@charity := @charity + a.charity AS charity1
				,@others := @others + a.others AS others1
				,@totalReceivables := @totalReceivables + a.totalReceivables AS totalReceivables1
				,@totalPayments := @totalPayments + a.totalPayments AS totalPayments1
				,@totalBalance := @totalBalance + a.totalBalance AS totalBalance1
			FROM(
				SELECT 
					a.*
					,b.*
				FROM(
					SELECT
						a.studentID, 
						a.studentName,
						b.*
					FROM 
						student AS a
					LEFT OUTER JOIN(
						SELECT * FROM gradelevel
					) AS b ON a.gradeLevelID = b.gradeLevelID
					$where
				) AS a
				
				LEFT OUTER JOIN(
					SELECT 
						a.studentID AS payStudentID
						,(IFNULL(a.annualRegistrationTotalReceivable,0) - IFNULL(b.annualRegistration,0)) AS annualRegistration
						,(IFNULL(a.tuitionTotalReceivable,0) - IFNULL(b.tuition,0)) AS tuition
						,(IFNULL(a.booksTotalReceivable,0) - IFNULL(b.books,0)) AS books
						,(IFNULL(a.uniformTotalReceivable,0) - IFNULL(b.uniform,0)) AS uniform
						,(IFNULL(a.cateringTotalReceivable,0) - IFNULL(b.catering,0)) AS catering
						,(IFNULL(a.extracurricularTotalReceivable,0) - IFNULL(b.extraCurricular,0)) AS extraCurricular
						,(IFNULL(a.christmasTotalReceivable,0) - IFNULL(b.christmas,0)) AS christmas
						,(IFNULL(a.familyDayTotalReceivable,0) - IFNULL(b.familyDay,0)) AS familyDay
						,(IFNULL(a.pictureTotalReceivable,0) - IFNULL(b.picture,0)) AS picture
						,(IFNULL(a.gradFeeTotalReceivable,0) - IFNULL(b.gradFee,0)) AS gradFee
						,(IFNULL(a.scoutingTotalReceivable,0) - IFNULL(b.scouting,0)) AS scouting
						,(IFNULL(a.charityTotalReceivable,0) - IFNULL(b.charity,0)) AS charity
						,(IFNULL(a.othersTotalReceivable,0) - IFNULL(b.others,0)) AS others
				
						,(
							IFNULL(annualRegistrationTotalReceivable,0)
							+
							IFNULL(tuitionTotalReceivable,0)
							+
							IFNULL(booksTotalReceivable,0)
							+
							IFNULL(uniformTotalReceivable,0)
							+
							IFNULL(cateringTotalReceivable,0)
							+
							IFNULL(extracurricularTotalReceivable,0)
							+
							IFNULL(christmasTotalReceivable,0)
							+
							IFNULL(familyDayTotalReceivable,0)
							+
							IFNULL(pictureTotalReceivable,0)
							+
							IFNULL(gradFeeTotalReceivable,0)
							+
							IFNULL(scoutingTotalReceivable,0)
							+
							IFNULL(charityTotalReceivable,0)
							+
							IFNULL(othersTotalReceivable,0)
						) AS totalReceivables
				
						,(
							IFNULL(annualRegistration,0) 
							+
							IFNULL(tuition,0) 
							+
							IFNULL(books,0) 
							+
							IFNULL(uniform,0) 
							+
							IFNULL(catering,0) 
							+
							IFNULL(extraCurricular,0) 
							+
							IFNULL(christmas,0) 
							+
							IFNULL(familyDay,0) 
							+
							IFNULL(picture,0) 
							+
							IFNULL(gradFee,0) 
							+
							IFNULL(scouting,0) 
							+
							IFNULL(charity,0) 
							+
							IFNULL(others,0) 
						) AS totalPayments
				
						,(
				
				
							(
								IFNULL(annualRegistrationTotalReceivable,0) 
								+
								IFNULL(tuitionTotalReceivable,0) 
								+
								IFNULL(booksTotalReceivable,0) 
								+
								IFNULL(uniformTotalReceivable,0) 
								+
								IFNULL(cateringTotalReceivable,0) 
								+
								IFNULL(extracurricularTotalReceivable,0) 
								+
								IFNULL(christmasTotalReceivable,0) 
								+
								IFNULL(familyDayTotalReceivable,0) 
								+
								IFNULL(pictureTotalReceivable,0) 
								+
								IFNULL(gradFeeTotalReceivable,0) 
								+
								IFNULL(scoutingTotalReceivable,0) 
								+
								IFNULL(charityTotalReceivable,0) 
								+
								IFNULL(othersTotalReceivable,0) 
							)
							-
							(
								IFNULL(annualRegistration,0) 
								+
								IFNULL(tuition,0) 
								+
								IFNULL(books,0) 
								+
								IFNULL(uniform,0) 
								+
								IFNULL(catering,0) 
								+
								IFNULL(extraCurricular,0) 
								+
								IFNULL(christmas,0) 
								+
								IFNULL(familyDay,0) 
								+
								IFNULL(picture,0) 
								+
								IFNULL(gradFee,0) 
								+
								IFNULL(scouting,0) 
								+
								IFNULL(charity,0) 
								+
								IFNULL(others,0) 
							)
						) AS totalBalance
				
					FROM(
						SELECT 
							studentID
							,SUM(IFNULL(annualRegistrationTotalReceivable,0)) AS annualRegistrationTotalReceivable
							,SUM(IFNULL(tuitionTotalReceivable,0)) AS tuitionTotalReceivable
							,SUM(IFNULL(booksTotalReceivable,0)) AS booksTotalReceivable
							,SUM(IFNULL(uniformTotalReceivable,0)) AS uniformTotalReceivable
							,SUM(IFNULL(cateringTotalReceivable,0)) AS cateringTotalReceivable
							,SUM(IFNULL(extracurricularTotalReceivable,0)) AS extracurricularTotalReceivable
							,SUM(IFNULL(christmasTotalReceivable,0)) AS christmasTotalReceivable
							,SUM(IFNULL(familyDayTotalReceivable,0)) AS familyDayTotalReceivable
							,SUM(IFNULL(pictureTotalReceivable,0)) AS pictureTotalReceivable
							,SUM(IFNULL(gradFeeTotalReceivable,0)) AS gradFeeTotalReceivable
							,SUM(IFNULL(scoutingTotalReceivable,0)) AS scoutingTotalReceivable
							,SUM(IFNULL(charityTotalReceivable,0)) AS charityTotalReceivable
							,SUM(IFNULL(othersTotalReceivable,0)) AS othersTotalReceivable
						FROM 
							accountcard
						-- WHERE dateCreated <= '". date('Y-m-d', strtotime($params['asOfDate']) ) ."'
						GROUP BY 
							studentID
					) AS a
					LEFT OUTER JOIN(
						SELECT 
							studentID AS payStudentID
							,SUM(IFNULL(annualRegistration,0)) AS annualRegistration
							,SUM(IFNULL(tuition,0)) AS tuition
							,SUM(IFNULL(books,0)) AS books
							,SUM(IFNULL(uniform,0)) AS uniform
							,SUM(IFNULL(catering,0)) AS catering
							,SUM(IFNULL(extraCurricular,0)) AS extraCurricular
							,SUM(IFNULL(christmas,0)) AS christmas
							,SUM(IFNULL(familyDay,0)) AS familyDay
							,SUM(IFNULL(picture,0)) AS picture
							,SUM(IFNULL(gradFee,0)) AS gradFee
							,SUM(IFNULL(scouting,0)) AS scouting
							,SUM(IFNULL(charity,0)) AS charity
							,SUM(IFNULL(others,0)) AS others
						FROM 
							payments
						WHERE 
							paymentDate <= '". date('Y-m-d', strtotime($params['asOfDate']) ) ."'
							AND (status = 0 OR status IS NULL)
						GROUP BY 
							studentID
					) AS b ON a.studentID = b.payStudentID
				) AS b ON a.studentID = b.payStudentID
				ORDER BY a.gradeLevelID ASC, a.studentName ASC
			) AS a
					
			LEFT OUTER JOIN(
				SELECT 
					@annualRegistration := 0
					,@tuition := 0
					,@books := 0
					,@uniform := 0
					,@catering := 0
					,@extraCurricular := 0
					,@christmas := 0
					,@familyDay := 0
					,@picture := 0
					,@gradFee := 0
					,@scouting := 0
					,@charity := 0
					,@others := 0
					,@totalReceivables := 0
					,@totalPayments := 0
					,@totalBalance := 0

			) AS b ON 1 = 1
			
			ORDER BY a.studentName ASC

		")->result_array();
		
	}

}	