<?php namespace App\Http\Controllers\Tools;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use EndaEditor;

use Illuminate\Http\Request;

class MarkDownController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function getIndex()
	{
		return View('mark.mark');
	}

    /**
     * 上传 图片
     * @return mixed|string
     */
    public function postUpload(){

        // endaEdit 为你 public 下的目录   @update 2015-05-19 前的版本请更新才能使用
        $data = EndaEditor::uploadImgFile('endaEdit');

        return json_encode($data);
    }

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
