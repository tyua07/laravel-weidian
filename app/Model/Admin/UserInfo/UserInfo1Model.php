<?php
namespace App\Model\Admin\UserInfo;

use App\Model\Admin\BaseModel;

/**
 * +----------------------------------------------------------------------
 * | date: 2016-01-24 14:02:30
 * +----------------------------------------------------------------------
 * | UserInfo1Model.php: 会员模型
 * +----------------------------------------------------------------------
 * | Author: yangyifan <yangyifanphp@gmail.com>
 * +----------------------------------------------------------------------
 */
class UserInfo1Model extends BaseModel {

	/**
	 * 设置模型表名称
	 *
	 * @var string
	 */
	protected $table = 'add_user';

	/**
	 * 搜索
	 *
	 * @author yangyifan <yangyifanphp@gmail.com>
	 *
	 * @param string $map 搜索规则数组
	 * @param string $sort 排序字段
	 * @param string $order 排序规则
	 * @param string $limit 显示条数
	 * @param string $offset 偏移量
	 */
	protected static function search($map, $sort, $order, $limit, $offset) {
		return [
				'data' =>   self::mergeData(
						self::multiwhere($map)->
						orderBy($sort, $order)->
						skip($offset)->
						take($limit)->
						get()
				),
				'count' =>  self::multiwhere($map)->count(),
		];
	}

	/**
	 * 组合数据
	 *
	 * @author yangyifan <yangyifanphp@gmail.com>
	 *
	 * @param mixed $data 搜索数据
	 */
	private static function mergeData($data) {
		if (!empty($data)) {
			foreach ($data as &$v) {
				$v->handle = '<a href="'.createUrl('Admin\UserInfo\UserInfo1Controller@getEdit', ['id' => $v->id]).'"  >修改</a>';
			}
		}
		return $data;
	}
}
